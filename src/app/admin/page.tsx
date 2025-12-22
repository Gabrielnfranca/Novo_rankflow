import { getUsers } from "@/app/actions/users"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Shield, User } from "lucide-react"

export default async function AdminPage() {
  const users = await getUsers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Usuários</h2>
          <p className="text-muted-foreground">
            Controle de acesso e administração de contas.
          </p>
        </div>
        <AddUserDialog />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{users.filter(u => u.role === 'ADMIN').length}</div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
          <CardDescription>Lista de todos os usuários com acesso ao sistema.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Função</TableHead>
                <TableHead>Data de Criação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                        </div>
                        {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role === 'ADMIN' ? 'Administrador' : 'Usuário'}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(user.createdAt, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <ResetPasswordDialog userId={user.id} userName={user.name} />
                        <DeleteUserDialog userId={user.id} userName={user.name} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        Nenhum usuário encontrado.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
