import { getUsers } from "@/app/actions/users"
import { getMarketplaceItems } from "@/app/actions/marketplace"
import { getNotifications } from "@/app/actions/notifications"
import { getTickets } from "@/app/actions/support"
import { AddUserDialog } from "@/components/admin/add-user-dialog"
import { AddMarketplaceItemDialog } from "@/components/admin/add-marketplace-item-dialog"
import { EditMarketplaceItemDialog } from "@/components/admin/edit-marketplace-item-dialog"
import { DeleteMarketplaceItemDialog } from "@/components/admin/delete-marketplace-item-dialog"
import { AddNotificationDialog } from "@/components/admin/add-notification-dialog"
import { DeleteNotificationDialog } from "@/components/admin/delete-notification-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { User, ShoppingBag, MessageSquare, Bell } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default async function AdminPage() {
  const [users, marketplaceItems, notifications, tickets] = await Promise.all([
    getUsers(),
    getMarketplaceItems(),
    getNotifications(),
    getTickets()
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Painel Administrativo</h2>
          <p className="text-muted-foreground">
            Gerencie usuários, marketplace, suporte e notificações.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Marketplace</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{marketplaceItems.length}</div>
                <p className="text-xs text-muted-foreground">Itens cadastrados</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Suporte</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{tickets.filter(t => t.status === 'OPEN').length}</div>
                <p className="text-xs text-muted-foreground">Chamados abertos</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notificações</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{notifications.length}</div>
                <p className="text-xs text-muted-foreground">Enviadas</p>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="support">Suporte</TabsTrigger>
          <TabsTrigger value="notifications">Comunicados</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
             <AddUserDialog />
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados</CardTitle>
              <CardDescription>Lista completa de usuários do sistema.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Função</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
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
                        <TableCell>
                          {format(new Date(user.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                                <ResetPasswordDialog userId={user.id} userName={user.name} />
                                <DeleteUserDialog userId={user.id} userName={user.name} />
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketplace" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Gestão do Marketplace</h3>
            <AddMarketplaceItemDialog />
          </div>
          <Card>
             <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Domínio</TableHead>
                      <TableHead>DR</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketplaceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.domain}</TableCell>
                        <TableCell>{item.dr}</TableCell>
                        <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                        <TableCell>{item.niche || "-"}</TableCell>
                        <TableCell>
                          <Badge variant={item.status === 'Available' ? 'default' : 'secondary'}>
                            {item.status === 'Available' ? 'Disponível' : item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                              <EditMarketplaceItemDialog item={item} />
                              <DeleteMarketplaceItemDialog itemId={item.id} domain={item.domain} />
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {marketplaceItems.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                Nenhum item cadastrado.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Chamados de Suporte</h3>
          </div>
          <Card>
             <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assunto</TableHead>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">{ticket.subject}</TableCell>
                        <TableCell>{ticket.user.name}</TableCell>
                        <TableCell>
                          <Badge variant={ticket.status === 'OPEN' ? 'destructive' : ticket.status === 'ANSWERED' ? 'default' : 'secondary'}>
                            {ticket.status === 'OPEN' ? 'Aberto' : ticket.status === 'ANSWERED' ? 'Respondido' : 'Fechado'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ticket.updatedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                           {/* Actions for tickets will be implemented later if needed */}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tickets.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                Nenhum chamado aberto.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Comunicados Globais</h3>
            <AddNotificationDialog />
          </div>
          <Card>
             <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {notifications.map((notification) => (
                      <TableRow key={notification.id}>
                        <TableCell className="font-medium">{notification.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{notification.type}</Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(notification.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                           <div className="flex items-center justify-end gap-2">
                              <DeleteNotificationDialog notificationId={notification.id} title={notification.title} />
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {notifications.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                Nenhuma notificação enviada.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
