"use server"

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"

export async function addKeyword(formData: FormData) {
  const term = formData.get("term") as string
  const url = formData.get("url") as string
  const difficulty = formData.get("difficulty") as string || "Medium"
  const volume = formData.get("volume") as string || "N/A"
  const clientId = formData.get("clientId") as string | null

  if (!term) {
    return { error: "Palavra-chave é obrigatória" }
  }

  try {
    await prisma.keyword.create({
      data: {
        term,
        url,
        difficulty,
        volume,
        position: 0, // Inicialmente 0
        previousPosition: 0,
        clientId: clientId || undefined,
      },
    })

    revalidatePath("/dashboard/rank-tracker")
    if (clientId) {
        revalidatePath(`/dashboard/clients/${clientId}/keywords`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar keyword:", error instanceof Error ? error.message : String(error))
    return { error: "Erro ao salvar no banco de dados" }
  }
}

export async function getKeywords(clientId?: string) {
  try {
    console.log("Iniciando busca de keywords...");
    const session = await getSession()
    const user = session?.user

    if (user?.role !== 'ADMIN' && !user?.id) return []

    // If specific client requested, check ownership
    if (clientId) {
        const client = await prisma.client.findUnique({ where: { id: clientId } })
        if (!client) return []
        if (user?.role !== 'ADMIN' && client.userId !== user?.id) return [] 
    }

    const where: Prisma.KeywordWhereInput = clientId 
        ? { clientId } 
        : (user?.role === 'ADMIN' ? {} : { client: { userId: user?.id } })

    const keywords = await prisma.keyword.findMany({
      where,
      orderBy: { createdAt: "desc" },
    })
    console.log(`Encontradas ${keywords.length} keywords.`);
    return keywords
  } catch (error) {
    console.error("Erro ao buscar keywords:", error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function addClient(formData: FormData) {
  const name = formData.get("name") as string
  const url = formData.get("url") as string
  const color = formData.get("color") as string || "#000000"
  const monthlyValue = parseFloat(formData.get("monthlyValue") as string) || 0
  const annualRevenue = parseFloat(formData.get("annualRevenue") as string) || 0
  const contractDuration = formData.get("contractDuration") as string
  const notes = formData.get("notes") as string
  const startDateStr = formData.get("startDate") as string
  const startDate = startDateStr ? new Date(startDateStr) : undefined
  
  const cnpj = formData.get("cnpj") as string
  const phone = formData.get("phone") as string
  const email = formData.get("email") as string
  const address = formData.get("address") as string

  if (!name) {
    return { error: "Nome do cliente é obrigatório" }
  }

  const session = await getSession()
  if (!session?.user?.id) {
    return { error: "Usuário não autenticado" }
  }

  try {
    await prisma.client.create({
      data: {
        name,
        url,
        color,
        monthlyValue,
        annualRevenue,
        contractDuration,
        notes,
        startDate,
        cnpj,
        phone,
        email,
        address,
        user: {
          connect: { id: session.user.id }
        }
      },
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error instanceof Error ? error.message : String(error))
    return { error: "Erro ao salvar cliente" }
  }
}

export async function deleteClient(id: string) {
  try {
    const session = await getSession()
    const user = session?.user

    if (!user?.id) return { error: "Não autorizado" }

    const client = await prisma.client.findUnique({ where: { id } })
    if (!client) return { error: "Cliente não encontrado" }

    if (user.role !== 'ADMIN' && client.userId !== user.id) {
        return { error: "Sem permissão" }
    }

    await prisma.client.delete({ where: { id } })
    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return { error: "Erro ao excluir cliente" }
  }
}

export async function getClients() {
  try {
    const session = await getSession()
    const user = session?.user
    
    if (user?.role !== 'ADMIN' && !user?.id) return []

    const where: Prisma.ClientWhereInput = user?.role === 'ADMIN' ? {} : { userId: user?.id }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { keywords: true, backlinks: true }
        }
      }
    })
    return clients
  } catch (error) {
    console.error("Erro ao buscar clientes:", error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function getSidebarClients() {
  try {
    const session = await getSession()
    const user = session?.user
    
    if (user?.role !== 'ADMIN' && !user?.id) return []

    const where: Prisma.ClientWhereInput = user?.role === 'ADMIN' ? {} : { userId: user?.id }

    const clients = await prisma.client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        url: true
      }
    })
    return clients
  } catch (error) {
    console.error("Erro ao buscar clientes para sidebar:", error instanceof Error ? error.message : String(error))
    return []
  }
}

export async function getClient(id: string) {
  try {
    const session = await getSession()
    const user = session?.user

    const client = await prisma.client.findUnique({
      where: { id },
    })

    if (!client) return null
    
    if (user?.role !== 'ADMIN' && client.userId !== user?.id) {
        return null
    }

    return client
  } catch (error) {
    console.error("Erro ao buscar cliente:", error instanceof Error ? error.message : String(error))
    return null
  }
}

export async function getDashboardStats() {
  try {
    const session = await getSession()
    const user = session?.user
    
    if (user?.role !== 'ADMIN' && !user?.id) {
         return {
            totalClients: 0,
            totalKeywords: 0,
            top3: 0,
            top10: 0,
            top100: 0,
            distribution: [],
            winners: [],
            losers: []
         }
    }

    const clientWhere: Prisma.ClientWhereInput = user?.role === 'ADMIN' ? {} : { userId: user?.id }
    const keywordWhere: Prisma.KeywordWhereInput = user?.role === 'ADMIN' ? {} : { client: { userId: user?.id } }

    const [totalClients, totalKeywords, keywords] = await Promise.all([
      prisma.client.count({ where: clientWhere }),
      prisma.keyword.count({ where: keywordWhere }),
      prisma.keyword.findMany({
        where: keywordWhere,
        include: { client: true }
      })
    ])

    const top3 = keywords.filter(k => k.position > 0 && k.position <= 3).length
    const top10 = keywords.filter(k => k.position > 0 && k.position <= 10).length
    const top100 = keywords.filter(k => k.position > 0 && k.position <= 100).length

    // Distribution
    const distribution = [
      { name: "Top 3", value: top3, fill: "#22c55e" }, // green-500
      { name: "4-10", value: top10 - top3, fill: "#3b82f6" }, // blue-500
      { name: "11-20", value: keywords.filter(k => k.position > 10 && k.position <= 20).length, fill: "#eab308" }, // yellow-500
      { name: "21-100", value: keywords.filter(k => k.position > 20 && k.position <= 100).length, fill: "#f97316" }, // orange-500
      { name: "100+", value: keywords.filter(k => k.position === 0 || k.position > 100).length, fill: "#ef4444" }, // red-500
    ]

    // Winners & Losers
    const winners = keywords
      .filter(k => k.position > 0 && k.previousPosition > 0 && k.position < k.previousPosition)
      .sort((a, b) => (b.previousPosition - b.position) - (a.previousPosition - a.position))
      .slice(0, 5)

    const losers = keywords
      .filter(k => k.position > 0 && k.previousPosition > 0 && k.position > k.previousPosition)
      .sort((a, b) => (b.position - b.previousPosition) - (a.position - a.previousPosition))
      .slice(0, 5)

    return {
      totalClients,
      totalKeywords,
      top3,
      top10,
      top100,
      distribution,
      winners,
      losers
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error)
    return {
      totalClients: 0,
      totalKeywords: 0,
      top3: 0,
      top10: 0,
      top100: 0,
      distribution: [],
      winners: [],
      losers: []
    }
  }
}

export async function addBacklink(formData: FormData) {
  const domain = formData.get("domain") as string
  const status = formData.get("status") as string || "Prospecting"
  const owner = formData.get("owner") as string
  const keyword = formData.get("keyword") as string
  const volume = formData.get("volume") as string
  const intent = formData.get("intent") as string
  const h1 = formData.get("h1") as string
  const title = formData.get("title") as string
  const metaDescription = formData.get("metaDescription") as string
  const anchorText = formData.get("anchorText") as string
  const driveUrl = formData.get("driveUrl") as string
  const postUrl = formData.get("postUrl") as string
  const targetUrl = formData.get("targetUrl") as string
  const clientId = formData.get("clientId") as string | null
  
  const dateSentStr = formData.get("dateSent") as string
  const dateSent = dateSentStr ? new Date(dateSentStr) : undefined
  
  const followUpDateStr = formData.get("followUpDate") as string
  const followUpDate = followUpDateStr ? new Date(followUpDateStr) : undefined
  
  const costStr = formData.get("cost") as string
  const cost = costStr ? parseFloat(costStr.replace("R$", "").replace(".", "").replace(",", ".")) : 0

  if (!domain) {
    return { error: "Domínio é obrigatório" }
  }

  try {
    await prisma.backlink.create({
      data: {
        domain,
        status,
        owner,
        keyword,
        volume,
        intent,
        h1,
        title,
        metaDescription,
        anchorText,
        driveUrl,
        postUrl,
        targetUrl,
        dateSent,
        followUpDate,
        cost,
        clientId: clientId || undefined,
      },
    })

    if (clientId) {
        revalidatePath(`/dashboard/clients/${clientId}/backlinks`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao adicionar backlink:", error)
    return { error: "Erro ao salvar backlink" }
  }
}

export async function updateBacklink(formData: FormData) {
  const id = parseInt(formData.get("id") as string)
  const domain = formData.get("domain") as string
  const status = formData.get("status") as string
  const owner = formData.get("owner") as string
  const keyword = formData.get("keyword") as string
  const volume = formData.get("volume") as string
  const intent = formData.get("intent") as string
  const h1 = formData.get("h1") as string
  const title = formData.get("title") as string
  const metaDescription = formData.get("metaDescription") as string
  const anchorText = formData.get("anchorText") as string
  const driveUrl = formData.get("driveUrl") as string
  const postUrl = formData.get("postUrl") as string
  const targetUrl = formData.get("targetUrl") as string
  const clientId = formData.get("clientId") as string | null
  
  const dateSentStr = formData.get("dateSent") as string
  const dateSent = dateSentStr ? new Date(dateSentStr) : null // Use null to clear if empty
  
  const followUpDateStr = formData.get("followUpDate") as string
  const followUpDate = followUpDateStr ? new Date(followUpDateStr) : null // Use null to clear if empty

  const costStr = formData.get("cost") as string
  const cost = costStr ? parseFloat(costStr.replace("R$", "").replace(".", "").replace(",", ".")) : 0

  if (!id || !domain) {
    return { error: "ID e Domínio são obrigatórios" }
  }

  try {
    await prisma.backlink.update({
      where: { id },
      data: {
        domain,
        status,
        owner,
        keyword,
        volume,
        intent,
        h1,
        title,
        metaDescription,
        anchorText,
        driveUrl,
        postUrl,
        targetUrl,
        dateSent,
        followUpDate,
        cost,
      },
    })

    if (clientId) {
        revalidatePath(`/dashboard/clients/${clientId}/backlinks`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar backlink:", error)
    return { error: "Erro ao atualizar backlink" }
  }
}

export async function deleteBacklink(id: number, clientId?: string) {
  try {
    await prisma.backlink.delete({
      where: { id },
    })

    if (clientId) {
      revalidatePath(`/dashboard/clients/${clientId}/backlinks`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir backlink:", error)
    return { error: "Erro ao excluir backlink" }
  }
}

export async function getBacklinks(clientId?: string) {
  try {
    const session = await getSession()
    const user = session?.user

    if (user?.role !== 'ADMIN' && !user?.id) return []

    // If specific client requested, check ownership
    if (clientId) {
        const client = await prisma.client.findUnique({ where: { id: clientId } })
        if (!client) return []
        if (user?.role !== 'ADMIN' && client.userId !== user?.id) return [] 
    }

    const where: Prisma.BacklinkWhereInput = clientId 
        ? { clientId } 
        : (user?.role === 'ADMIN' ? {} : { client: { userId: user?.id } })

    const backlinks = await prisma.backlink.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        client: {
          select: {
            name: true
          }
        }
      }
    })
    return backlinks
  } catch (error) {
    console.error("Erro ao buscar backlinks:", error)
    return []
  }
}

export async function updateKeywordPosition(keywordId: number, newPosition: number, clientId?: string) {
  try {
    const keyword = await prisma.keyword.findUnique({
      where: { id: keywordId },
    })

    if (!keyword) {
      return { error: "Palavra-chave não encontrada" }
    }

    await prisma.$transaction([
      prisma.keywordHistory.create({
        data: {
          keywordId,
          position: newPosition,
        },
      }),
      prisma.keyword.update({
        where: { id: keywordId },
        data: {
          previousPosition: keyword.position,
          position: newPosition,
        },
      }),
    ])

    if (clientId) {
      revalidatePath(`/dashboard/clients/${clientId}/keywords`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar posição:", error)
    return { error: "Erro ao atualizar posição" }
  }
}

export async function getKeywordHistory(keywordId: number) {
  try {
    const session = await getSession()
    const user = session?.user

    const keyword = await prisma.keyword.findUnique({
        where: { id: keywordId },
        include: { client: true }
    })
    
    if (!keyword) return []
    
    // Check if keyword has a client and if user has access to it
    if (user?.role !== 'ADMIN') {
        // If keyword has no client, it might be an orphan or global. 
        // If the logic requires strict ownership, we should hide it.
        // If keyword.client is null, keyword.client.userId will throw.
        if (!keyword.client || keyword.client.userId !== user?.id) {
            return []
        }
    }

    const history = await prisma.keywordHistory.findMany({
      where: { keywordId },
      orderBy: { date: "asc" },
    })
    return history
  } catch (error) {
    console.error("Erro ao buscar histórico:", error)
    return []
  }
}

export async function updateKeyword(formData: FormData) {
  const id = parseInt(formData.get("id") as string)
  const term = formData.get("term") as string
  const url = formData.get("url") as string
  const difficulty = formData.get("difficulty") as string
  const volume = formData.get("volume") as string
  const clientId = formData.get("clientId") as string | null

  if (!id || !term) {
    return { error: "ID e Termo são obrigatórios" }
  }

  try {
    await prisma.keyword.update({
      where: { id },
      data: {
        term,
        url,
        difficulty,
        volume,
      },
    })

    if (clientId) {
        revalidatePath(`/dashboard/clients/${clientId}/keywords`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar keyword:", error)
    return { error: "Erro ao atualizar keyword" }
  }
}

export async function deleteKeyword(id: number, clientId?: string) {
  try {
    await prisma.keyword.delete({
      where: { id },
    })

    if (clientId) {
      revalidatePath(`/dashboard/clients/${clientId}/keywords`)
    }
    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir keyword:", error)
    return { error: "Erro ao excluir keyword" }
  }
}

export async function getClientReportStats(clientId: string) {
  try {
    const session = await getSession()
    const user = session?.user

    const client = await prisma.client.findUnique({
      where: { id: clientId },
    })

    if (!client) return null
    if (user?.role !== 'ADMIN' && client.userId !== user?.id) return null

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const [
      totalKeywords,
      keywords,
      totalBacklinks,
      newBacklinks,
      publishedBacklinks,
      completedTasks,
      newContent,
      keywordHistory,
      backlinkHistoryData
    ] = await Promise.all([
      prisma.keyword.count({ where: { clientId } }),
      prisma.keyword.findMany({ where: { clientId } }),
      prisma.backlink.count({ where: { clientId } }),
      prisma.backlink.count({ 
        where: { 
          clientId, 
          createdAt: { gte: sevenDaysAgo } 
        } 
      }),
      prisma.backlink.count({ 
        where: { 
          clientId, 
          status: 'Published',
          updatedAt: { gte: sevenDaysAgo } 
        } 
      }),
      prisma.contentTask.count({ 
        where: { 
          clientId, 
          column: 'Done',
          createdAt: { gte: sevenDaysAgo }
        } 
      }),
      prisma.contentTask.count({
        where: {
            clientId,
            createdAt: { gte: sevenDaysAgo }
        }
      }),
      prisma.keywordHistory.findMany({
        where: {
            keyword: { clientId },
            date: { gte: thirtyDaysAgo }
        },
        include: { keyword: true }
      }),
      prisma.backlink.findMany({
        where: {
            clientId,
            createdAt: { gte: sixMonthsAgo }
        },
        select: { createdAt: true }
      })
    ])

    const top3 = keywords.filter(k => k.position > 0 && k.position <= 3).length
    const top10 = keywords.filter(k => k.position > 0 && k.position <= 10).length
    const top100 = keywords.filter(k => k.position > 0 && k.position <= 100).length
    
    // Calculate movers
    const winners = keywords
      .filter(k => k.position > 0 && k.previousPosition > 0 && k.position < k.previousPosition)
      .sort((a, b) => (b.previousPosition - b.position) - (a.previousPosition - a.position))
      .slice(0, 5)

    // Process Rank History
    const rankHistoryMap = new Map<string, { top3: number, top10: number, top100: number }>()
    
    // Initialize with 0s for the last 30 days
    for (let i = 0; i < 30; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const dateStr = d.toISOString().split('T')[0]
        rankHistoryMap.set(dateStr, { top3: 0, top10: 0, top100: 0 })
    }

    // Populate with history data
    keywordHistory.forEach(h => {
        const dateStr = h.date.toISOString().split('T')[0]
        if (rankHistoryMap.has(dateStr)) {
            const entry = rankHistoryMap.get(dateStr)!
            if (h.position > 0 && h.position <= 3) entry.top3++
            if (h.position > 0 && h.position <= 10) entry.top10++
            if (h.position > 0 && h.position <= 100) entry.top100++
        }
    })

    const rankHistory = Array.from(rankHistoryMap.entries())
        .map(([date, data]) => ({ date, ...data }))
        .sort((a, b) => a.date.localeCompare(b.date))

    // Process Backlink History
    const backlinkHistoryMap = new Map<string, number>()
    for (let i = 0; i < 6; i++) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthStr = d.toISOString().slice(0, 7) // YYYY-MM
        backlinkHistoryMap.set(monthStr, 0)
    }

    backlinkHistoryData.forEach(b => {
        const monthStr = b.createdAt.toISOString().slice(0, 7)
        if (backlinkHistoryMap.has(monthStr)) {
            backlinkHistoryMap.set(monthStr, backlinkHistoryMap.get(monthStr)! + 1)
        }
    })

    const backlinkHistory = Array.from(backlinkHistoryMap.entries())
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))

    return {
      clientName: client.name,
      period: {
        start: sevenDaysAgo,
        end: new Date()
      },
      seo: {
        totalKeywords,
        top3,
        top10,
        top100,
        winners,
        history: rankHistory
      },
      backlinks: {
        total: totalBacklinks,
        new: newBacklinks,
        published: publishedBacklinks,
        history: backlinkHistory
      },
      content: {
        newTasks: newContent,
        completedTasks: completedTasks
      }
    }
  } catch (error) {
    console.error("Erro ao gerar relatório:", error)
    return null
  }
}
