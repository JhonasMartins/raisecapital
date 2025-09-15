"use client"

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Testimonial {
  id: number
  quote: string
  description: string
  author: string
  role: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Processo rápido e sem complicação.",
    description: "Em poucos minutos meu cadastro estava pronto e já pude acompanhar as oportunidades. Recomendo!",
    author: "C. Johns",
    role: "Investidora",
    avatar: "/avaliacao/irene-strong-v2aKnjMbP_k-unsplash.jpg"
  },
  {
    id: 2,
    quote: "Plataforma muito intuitiva e segura.",
    description: "A transparência das informações me deu muita confiança para investir. Excelente experiência!",
    author: "M. Silva",
    role: "Empresário",
    avatar: "/avaliacao/jonathan-borba-5rQG1mib90I-unsplash.jpg"
  },
  {
    id: 3,
    quote: "Suporte excepcional e retornos consistentes.",
    description: "A equipe sempre disponível para esclarecer dúvidas. Já obtive ótimos resultados nos meus investimentos.",
    author: "R. Santos",
    role: "Investidor",
    avatar: "/avaliacao/meritt-thomas-aoQ4DYZLE_E-unsplash.jpg"
  },
  {
    id: 4,
    quote: "Diversificação de portfólio nunca foi tão fácil.",
    description: "Consegui diversificar meus investimentos de forma estratégica. A plataforma oferece ótimas oportunidades.",
    author: "A. Costa",
    role: "Analista Financeiro",
    avatar: "/avaliacao/irene-strong-v2aKnjMbP_k-unsplash.jpg"
  }
]

export function TestimonialsCarousel() {
  const [emblaRef] = useEmblaCarousel(
    { 
      loop: true,
      dragFree: false,
      containScroll: 'trimSnaps'
    }, 
    [
      Autoplay({ 
        delay: 4000,
        stopOnInteraction: false,
        stopOnMouseEnter: true
      })
    ]
  )

  return (
    <div className="embla" ref={emblaRef}>
      <div className="embla__container">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="embla__slide">
            <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
              <p className="text-base font-medium text-white">
                "{testimonial.quote}"
              </p>
              <p className="mt-2 text-sm text-white/80">
                {testimonial.description}
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="h-8 w-8 rounded-full bg-white/20" />
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  <p className="text-white/70">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// CSS styles que devem ser adicionados ao globals.css ou como styled-components
export const emblaStyles = `
.embla {
  overflow: hidden;
}

.embla__container {
  display: flex;
}

.embla__slide {
  flex: 0 0 100%;
  min-width: 0;
}
`