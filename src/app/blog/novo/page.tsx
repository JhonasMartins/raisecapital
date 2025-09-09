'use client'

import { useState, useMemo, type ChangeEvent } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BlogNewArticlePage() {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [date, setDate] = useState('')
  const [author, setAuthor] = useState('')
  const [cover, setCover] = useState('')
  const [categories, setCategories] = useState('') // separado por vírgulas
  const [submitting, setSubmitting] = useState(false)
  const [resultMsg, setResultMsg] = useState<string | null>(null)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none dark:prose-invert min-h-[220px] rounded-md border bg-background px-4 py-3 focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  const paragraphs = useMemo(() => {
    const text = editor?.getText() ?? ''
    return text
      .split('\n')
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
  }, [editor?.state])

  async function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverError(null)
    setUploadingCover(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Falha no upload da imagem')
      }
      const data = await res.json()
      setCover(data.url)
    } catch (err: any) {
      setCoverError(err?.message || 'Falha no upload da imagem')
    } finally {
      setUploadingCover(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setResultMsg(null)
    try {
      const cats = categories
        .split(',')
        .map((c) => c.trim())
        .filter((c) => c.length > 0)

      // Garante capturar o conteúdo atual do editor no momento do envio
      const textNow = editor?.getText() ?? ''
      const bodyParagraphs = textNow
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0)

      const bodyHtml = editor?.getHTML() ?? ''

      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          date, // yyyy-mm-dd
          author,
          cover,
          categories: cats,
          body: bodyParagraphs,
          bodyHtml,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error || 'Falha ao criar artigo')
      }
      const data = await res.json()
      setResultMsg(`Artigo criado com sucesso! Slug: ${data.slug}`)
      // limpeza básica, mantendo data/autor se desejar
      setTitle('')
      setExcerpt('')
      setCover('')
      setCategories('')
      editor?.commands.clearContent(true)
    } catch (err: any) {
      setResultMsg(err?.message || 'Erro inesperado')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh font-sans pt-28">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <h1 className="text-2xl font-semibold">Novo Artigo (temporário)</h1>
          <p className="mt-1 text-sm text-muted-foreground">Página temporária para criação de artigos do blog</p>
        </div>
      </header>

      <main className="py-8">
        <div className="mx-auto max-w-4xl px-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do artigo</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Título</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Título do artigo"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Resumo (excerpt)</label>
                    <textarea
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-20"
                      placeholder="Um breve resumo do conteúdo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Autor</label>
                    <input
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Nome do autor"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Capa (upload de imagem)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverChange}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      {uploadingCover
                        ? 'Enviando imagem…'
                        : cover
                        ? `Arquivo enviado: ${cover}`
                        : 'Selecione uma imagem para enviar'}
                    </div>
                    {coverError && (
                      <div className="mt-2 text-xs text-red-600">{coverError}</div>
                    )}
                    {cover && (
                      <div className="mt-3">
                        <img
                          src={cover}
                          alt="Capa do artigo"
                          className="h-32 w-full max-w-xs rounded-md border object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Categorias (separadas por vírgula)</label>
                    <input
                      value={categories}
                      onChange={(e) => setCategories(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                      placeholder="Investimento, Crowdfunding"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Conteúdo</label>
                  {editor && (
                    <div className="mb-2 flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setParagraph().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('paragraph') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        P
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        H3
                      </button>
                      <span className="mx-1 h-4 w-px bg-border" />
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        S
                      </button>
                      <span className="mx-1 h-4 w-px bg-border" />
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        • Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        1. Lista
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        ❝ Citação
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`border rounded px-2 py-1 text-xs ${editor.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                      >
                        {'</>'} Código
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        — HR
                      </button>
                      <span className="mx-1 h-4 w-px bg-border" />
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        ↶ Undo
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        className="border rounded px-2 py-1 text-xs"
                      >
                        ↷ Redo
                      </button>
                    </div>
                  )}
                  {editor && <EditorContent editor={editor} />}
                  <div className="mt-2 text-xs text-muted-foreground">
                    Parágrafos detectados: {paragraphs.length}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={submitting || uploadingCover || !cover}>
                    {submitting ? 'Publicando…' : 'Publicar artigo'}
                  </Button>
                  {resultMsg && (
                    <span className="text-sm text-muted-foreground">{resultMsg}</span>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}