"use client"

import { useState, useId, Fragment } from 'react'
import { ChevronDown } from 'lucide-react'
import sanitizeHtml from 'sanitize-html'

export type KeyVal = { label: string; value: string }

const richTextSanitize = (html: string) =>
  sanitizeHtml(html, {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'a',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td'
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      th: ['colspan', 'rowspan', 'align'],
      td: ['colspan', 'rowspan', 'align']
    },
    allowedSchemes: ['http', 'https', 'mailto']
  })

export default function EssentialInfoAccordion({ items }: { items: KeyVal[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  if (!items || items.length === 0) return null

  return (
    <div className="rounded-lg border bg-muted/30 divide-y">
      {items.map((kv, i) => {
        const open = openIndex === i
        const contentId = `${baseId}-essential-${i}`
        return (
          <Fragment key={i}>
            <div>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => toggle(i)}
                className="relative w-full flex items-center justify-between cursor-pointer list-none px-4 py-3 rounded-md bg-background hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              >
                <span className="flex items-center gap-2 text-base font-semibold text-foreground">
                  <span className="inline-block size-1.5 rounded-full bg-primary" aria-hidden />
                  {kv.label}
                </span>
                <ChevronDown
                  className={`size-4 text-muted-foreground/80 transition-transform ${open ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>
              <div
                id={contentId}
                data-open={open}
                className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 ease-out data-[open=true]:grid-rows-[1fr]"
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 pt-2 bg-muted/40 border-l-2 border-primary/60 ml-2 rounded-bl-md rounded-br-md">
                    {kv.value ? (
                      <div
                        className="prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: richTextSanitize(kv.value) }}
                      />
                    ) : (
                      <div className="text-sm text-muted-foreground">—</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )
      })}
    </div>
  )
}