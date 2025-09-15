"use client"

import React, { useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Testimonial {
  id: number
  text: string
  author: string
  role: string
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    text: "Processo rápido e sem complicação.",
    author: "C. Johns",
    role: "Investidora"
  },
  {
    id: 2,
    text: "Plataforma intuitiva e oportunidades excelentes.",
    author: "M. Silva",
    role: "Empreendedor"
  },
  {
    id: 3,
    text: "Suporte excepcional e transparência total.",
    author: "R. Costa",
    role: "Investidor"
  },
  {
    id: 4,
    text: "Interface moderna e funcionalidades completas.",
    author: "A. Santos",
    role: "Empresária"
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
                "{testimonial.text}"
              </p>
              <p className="mt-2 text-sm text-white/80">
                Em poucos minutos meu cadastro estava pronto e já pude acompanhar as oportunidades. Recomendo!
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