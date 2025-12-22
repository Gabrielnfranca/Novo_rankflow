'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function toggleRoadmapTask(clientId: string, taskKey: string, currentStatus: boolean) {
  try {
    const newStatus = currentStatus ? "PENDING" : "COMPLETED"
    
    if (newStatus === "COMPLETED") {
      await prisma.seoRoadmapTask.upsert({
        where: {
          clientId_taskKey: {
            clientId,
            taskKey
          }
        },
        update: {
          status: "COMPLETED",
          completedAt: new Date()
        },
        create: {
          clientId,
          taskKey,
          status: "COMPLETED",
          completedAt: new Date()
        }
      })
    } else {
      // If unchecking, we can either delete the record or set to PENDING.
      // Deleting keeps the DB cleaner if we only care about completed tasks.
      // But updating allows keeping history if we add more fields later.
      // Let's update for now.
      await prisma.seoRoadmapTask.update({
        where: {
          clientId_taskKey: {
            clientId,
            taskKey
          }
        },
        data: {
          status: "PENDING",
          completedAt: null
        }
      })
    }

    revalidatePath(`/dashboard/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    console.error("Error toggling roadmap task:", error)
    return { success: false, error: "Failed to update task" }
  }
}
