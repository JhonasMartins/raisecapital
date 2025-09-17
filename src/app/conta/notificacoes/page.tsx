'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Bell, Filter, Mail, Shield, Info, AlertTriangle, Pin, PinOff, Eye, EyeOff, Trash2 } from 'lucide-react'

interface NotificationItem {
  id: string
  titulo: string
  mensagem: string
  tipo: 'financeiro' | 'seguranca' | 'produto' | 'sistema'
  dataISO: string
  lida: boolean
  fixada?: boolean
}

interface Prefs {
  canais: { email: boolean; sms: boolean; push: boolean }
  tipos: { financeiro: boolean; seguranca: boolean; produto: boolean; sistema: boolean }
}

const ICON_BY_TIPO: Record<NotificationItem['tipo'], ReactNode> = {
  financeiro: <Bell className="h-4 w-4 text-emerald-600" />,
  seguranca: <Shield className="h-4 w-4 text-amber-600" />,
  produto: <Info className="h-4 w-4 text-blue-600" />,
  sistema: <AlertTriangle className="h-4 w-4 text-rose-600" />,
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}

export default function ContaNotificacoesPage() {
  const [notif, setNotif] = useState<NotificationItem[]>([])
  const [statusFiltro, setStatusFiltro] = useState<'todas' | 'nao_lidas' | 'fixadas'>('todas')
  const [tipoFiltro, setTipoFiltro] = useState<'todas' | NotificationItem['tipo']>('todas')
  const [prefs, setPrefs] = useState<Prefs>({
    canais: { email: true, sms: false, push: true },
    tipos: { financeiro: true, seguranca: true, produto: true, sistema: true },
  })
  const [savedMsg, setSavedMsg] = useState<string>('')

  // bootstrap local data
  useEffect(() => {
    const rawNotif = localStorage.getItem('notif_feed')
    const rawPrefs = localStorage.getItem('notif_prefs')

    if (rawPrefs) {
      try { setPrefs(JSON.parse(rawPrefs)) } catch {}
    }

    if (rawNotif) {
      try { setNotif(JSON.parse(rawNotif)) } catch {}
    } else {
      const seed: NotificationItem[] = [
        { id: '1', titulo: 'Provento creditado', mensagem: 'Você recebeu R$ 128,45 de proventos do ativo ABC11.', tipo: 'financeiro', dataISO: new Date().toISOString(), lida: false, fixada: true },
        { id: '2', titulo: 'Confirme seu e-mail', mensagem: 'Valide seu e-mail para garantir a segurança e receber avisos.', tipo: 'seguranca', dataISO: new Date(Date.now()-86400000).toISOString(), lida: false },
        { id: '3', titulo: 'Nova oferta disponível', mensagem: 'Conheça a nova oportunidade no setor AgroTech com rentabilidade alvo de 18% a.a.', tipo: 'produto', dataISO: new Date(Date.now()-2*86400000).toISOString(), lida: true },
        { id: '4', titulo: 'Manutenção agendada', mensagem: 'O sistema ficará indisponível no domingo de 02:00 às 03:00.', tipo: 'sistema', dataISO: new Date(Date.now()-3*86400000).toISOString(), lida: true },
      ]
      setNotif(seed)
      localStorage.setItem('notif_feed', JSON.stringify(seed))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('notif_feed', JSON.stringify(notif))
  }, [notif])

  const filtradas = useMemo(() => {
    let arr = [...notif]
    if (statusFiltro === 'nao_lidas') arr = arr.filter(n => !n.lida)
    if (statusFiltro === 'fixadas') arr = arr.filter(n => n.fixada)
    if (tipoFiltro !== 'todas') arr = arr.filter(n => n.tipo === tipoFiltro)
    // ordenar: fixadas primeiro, depois mais recentes
    return arr.sort((a, b) => Number(!!b.fixada) - Number(!!a.fixada) || new Date(b.dataISO).getTime() - new Date(a.dataISO).getTime())
  }, [notif, statusFiltro, tipoFiltro])

  function toggleRead(id: string) {
    setNotif(prev => prev.map(n => (n.id === id ? { ...n, lida: !n.lida } : n)))
  }
  function togglePin(id: string) {
    setNotif(prev => prev.map(n => (n.id === id ? { ...n, fixada: !n.fixada } : n)))
  }
  function removeItem(id: string) {
    setNotif(prev => prev.filter(n => n.id !== id))
  }
  function markAllRead() {
    setNotif(prev => prev.map(n => ({ ...n, lida: true })))
  }

  function savePrefs() {
    localStorage.setItem('notif_prefs', JSON.stringify(prefs))
    setSavedMsg('Preferências salvas!')
    setTimeout(() => setSavedMsg(''), 2000)
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Notificações</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seus avisos e gerencie suas preferências de comunicação.</p>
        </div>
      </div>

      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="feed" className="flex-1"><span className="mr-2">📣</span> Feed</TabsTrigger>
          <TabsTrigger value="prefs" className="flex-1"><span className="mr-2">⚙️</span> Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Feed</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={markAllRead}>Marcar todas como lidas</Button>
                <div className="hidden sm:block w-px h-6 bg-border" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Filter className="h-4 w-4" /> Filtros</div>
                <Select value={statusFiltro} onValueChange={(v: any) => setStatusFiltro(v)}>
                  <SelectTrigger className="w-[150px]"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="nao_lidas">Não lidas</SelectItem>
                    <SelectItem value="fixadas">Fixadas</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={tipoFiltro} onValueChange={(v: any) => setTipoFiltro(v)}>
                  <SelectTrigger className="w-[170px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todos os tipos</SelectItem>
                    <SelectItem value="financeiro">Financeiro</SelectItem>
                    <SelectItem value="seguranca">Segurança</SelectItem>
                    <SelectItem value="produto">Produto</SelectItem>
                    <SelectItem value="sistema">Sistema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {filtradas.length === 0 ? (
                <div className="rounded-md border p-6 text-center text-sm text-muted-foreground">Nenhuma notificação encontrada com os filtros atuais.</div>
              ) : (
                filtradas.map(n => (
                  <div key={n.id} className="rounded-md border p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {ICON_BY_TIPO[n.tipo]}
                          <div className="font-medium truncate">{n.titulo}</div>
                          {!n.lida && <Badge variant="info">Nova</Badge>}
                          {n.fixada && <Badge variant="secondary">Fixada</Badge>}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground break-words">{n.mensagem}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{formatDate(n.dataISO)}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => togglePin(n.id)} aria-label={n.fixada ? 'Desafixar' : 'Fixar'}>
                          {n.fixada ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleRead(n.id)} aria-label={n.lida ? 'Marcar como não lida' : 'Marcar como lida'}>
                          {n.lida ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(n.id)} aria-label="Remover">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prefs" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Preferências de comunicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="text-sm font-medium">Canais</div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {([
                    { key: 'email', label: 'E-mail' },
                    { key: 'sms', label: 'SMS' },
                    { key: 'push', label: 'Push' },
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={prefs.canais[key]} onCheckedChange={(v) => setPrefs(p => ({ ...p, canais: { ...p.canais, [key]: Boolean(v) } }))} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium">Tipos de aviso</div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  {([
                    { key: 'financeiro', label: 'Financeiro' },
                    { key: 'seguranca', label: 'Segurança' },
                    { key: 'produto', label: 'Produto' },
                    { key: 'sistema', label: 'Sistema' },
                  ] as const).map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={prefs.tipos[key as keyof Prefs['tipos']]} onCheckedChange={(v) => setPrefs(p => ({ ...p, tipos: { ...p.tipos, [key]: Boolean(v) } }))} />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button onClick={savePrefs}>Salvar preferências</Button>
                {savedMsg && <span className="text-sm text-emerald-600">{savedMsg}</span>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}