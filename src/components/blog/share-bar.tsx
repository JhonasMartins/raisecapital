"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export default function ShareBar({ title }: { title: string }) {
  const [url, setUrl] = useState('')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [])

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Compartilhar:</span>
      <Button asChild size="sm" variant="outline">
        <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`} target="_blank" rel="noopener noreferrer">X/Twitter</a>
      </Button>
      <Button asChild size="sm" variant="outline">
        <a href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </Button>
      <Button size="sm" variant="outline" onClick={() => navigator.share?.({ title, url }).catch(() => {})}>
        Compartilhar nativo
      </Button>
    </div>
  )
}