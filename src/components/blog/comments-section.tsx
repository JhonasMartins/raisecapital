"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type Comment = {
  id: number
  name: string
  message: string
  created_at: string
}

export default function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setComments(data.items || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message }),
      })
      if (res.ok) {
        setName('')
        setMessage('')
        await load()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Comentários</h2>
        {loading ? (
          <div className="text-sm text-muted-foreground">Carregando…</div>
        ) : comments.length === 0 ? (
          <div className="text-sm text-muted-foreground">Seja o primeiro a comentar.</div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => (
              <Card key={c.id}>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">
                    {c.name}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleString('pt-BR')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 text-sm whitespace-pre-wrap">{c.message}</CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            placeholder="Seu nome"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="sm:col-span-2">
            <textarea
              placeholder="Escreva seu comentário"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-24"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" disabled={submitting || !name.trim() || !message.trim()}>
          {submitting ? 'Enviando…' : 'Enviar comentário'}
        </Button>
      </form>
    </section>
  )
}