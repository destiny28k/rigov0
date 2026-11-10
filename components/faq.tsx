"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

const faqs = [
  {
    question: "What types of lights does RIGO offer?",
    answer:
      "Our indoor range includes LED panel lights (concealed and surface), COB downlights, cylinder COB lights, and track and spot lights, plus a range of outdoor fixtures. Most series come in multiple wattages, shapes and finishes.",
  },
  {
    question: "Which colour temperatures are available?",
    answer:
      "Most of our fixtures are available in white, natural white and warm white, and many series also offer a 3-in-1 option that lets you switch between all three with a single fixture.",
  },
  {
    question: "Do your products come with a warranty?",
    answer:
      "Yes. RIGO fixtures are covered by a 2-year warranty. If you face any issue, our customer care team will help you with a quick replacement or repair.",
  },
  {
    question: "Which wattage should I choose for my room?",
    answer:
      "It depends on the room size and ceiling height. As a rough guide, 6–12W works well for bedrooms and passages, while 15–24W suits living rooms and offices. Get in touch and we'll recommend the right fit for your space.",
  },
  {
    question: "Do you supply in bulk for projects and dealers?",
    answer:
      "Absolutely. We work with electricians, interior designers, builders and dealers on projects of every size. Contact us on WhatsApp or email for bulk pricing and dealership enquiries.",
  },
  {
    question: "How do I place an order or get a quote?",
    answer:
      "Simply message us on WhatsApp at +91 83690 51700 or email customercarerigo1@gmail.com with the products and quantities you need, and our team will get back to you with a quote.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-20 md:py-29">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-3xl mb-16">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6">FAQ</p>
          <h2 className="text-6xl font-medium leading-[1.15] tracking-tight mb-6 text-balance lg:text-7xl">
            Questions & Answers
          </h2>
        </div>

        <div>
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-border">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left group"
              >
                <span className="text-lg font-medium text-foreground transition-colors group-hover:text-foreground/70">
                  {faq.question}
                </span>
                <Plus
                  className={`w-6 h-6 text-foreground flex-shrink-0 transition-transform duration-300 ${
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
                <p className="text-muted-foreground leading-relaxed pb-6 pr-12">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
