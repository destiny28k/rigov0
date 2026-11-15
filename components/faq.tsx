"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

export function FAQ({ items: faqs }: { items: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="pt-8 pb-16 md:pt-12 md:pb-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-6 md:mb-8">
          <p className="text-muted-foreground text-xs md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6">FAQ</p>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-medium leading-[1.15] tracking-tight md:mb-6 text-balance">
            Questions & Answers
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-4 md:py-6 flex items-start justify-between gap-4 md:gap-6 text-left group"
              >
                <span className="text-base md:text-lg font-medium leading-snug text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-5 h-5 md:w-6 md:h-6 mt-0.5 md:mt-0 text-foreground flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-45" : "rotate-0"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed pb-5 md:pb-6 pr-9 md:pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
