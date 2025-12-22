"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { History, Plus } from "lucide-react"
import { getKeywordHistory, updateKeywordPosition } from "@/app/actions"
import { toast } from "sonner"

interface KeywordHistoryDialogProps {
  keyword: {
    id: number
    term: string
    position: number
    clientId?: string | null
  }
}

export function KeywordHistoryDialog({ keyword }: KeywordHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [newPosition, setNewPosition] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      loadHistory()
    }
  }, [open])

  async function loadHistory() {
    const data = await getKeywordHistory(keyword.id)
    setHistory(data)
  }

  async function handleUpdatePosition() {
    if (!newPosition) return

    setLoading(true)
    const result = await updateKeywordPosition(keyword.id, parseInt(newPosition), keyword.clientId || undefined)
    
    if (result.success) {
      toast.success("Posição atualizada com sucesso!")
      setNewPosition("")
      loadHistory()
    } else {
      toast.error("Erro ao atualizar posição")
    }
    setLoading(false)
  }

  const chartData = history.map(item => ({
    date: format(new Date(item.date), 'dd/MM', { locale: ptBR }),
    position: item.position
  }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" title="Ver Histórico">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Histórico de Posições: {keyword.term}</DialogTitle>
          <DialogDescription>
            Acompanhe a evolução do ranqueamento desta palavra-chave.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="h-[300px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis reversed domain={[1, 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="position" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sem histórico disponível.
              </div>
            )}
          </div>

          <div className="flex items-end gap-2">
            <div className="grid gap-1 flex-1">
              <Label htmlFor="position">Nova Posição</Label>
              <Input
                id="position"
                type="number"
                placeholder="Ex: 5"
                value={newPosition}
                onChange={(e) => setNewPosition(e.target.value)}
              />
            </div>
            <Button onClick={handleUpdatePosition} disabled={loading}>
              {loading ? "Salvando..." : "Atualizar"}
            </Button>
          </div>
          
          <div className="max-h-[200px] overflow-y-auto border rounded-md">
             <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                    <tr>
                        <th className="p-2 text-left">Data</th>
                        <th className="p-2 text-left">Posição</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id} className="border-t">
                            <td className="p-2">{format(new Date(item.date), "dd/MM/yyyy HH:mm", { locale: ptBR })}</td>
                            <td className="p-2 font-medium">{item.position}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
