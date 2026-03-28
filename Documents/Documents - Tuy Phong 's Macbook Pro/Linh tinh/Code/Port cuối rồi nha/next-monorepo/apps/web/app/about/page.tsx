import type { Metadata } from "next"
import dashboardFirstImage from "../images/Direction A_ Dashboard-first.png"
import { AboutClient } from "@/components/about-client"

export const metadata: Metadata = {
  title: "About — Leon",
  description:
    "Product designer. Buddhist practitioner. Searching for what clarity means through design, philosophy, and the open road.",
}

/* ─────────────────────────────────────────────
   Data
   ───────────────────────────────────────────── */

const CHAPTERS = [
  {
    year: "2019",
    conviction: "Design is not decoration",
    context:
      "Started in visual design. Learned quickly that beauty and clarity are different disciplines. Chose clarity.",
  },
  {
    year: "2020",
    conviction: "The best feature is the one you remove",
    context:
      "First 0-to-1 product. Built too much. Every feature is a promise you have to keep. Started subtracting.",
  },
  {
    year: "2021",
    conviction: "Systems outlive screens",
    context:
      "Screens get redesigned. Systems get inherited. Started thinking in patterns, tokens, and rules instead of mockups.",
  },
  {
    year: "2022",
    conviction: "Speed is a design material",
    context:
      "Joined a fintech serving millions. A design system that slows down the team is overhead, not design.",
  },
  {
    year: "2023",
    conviction: "The user’s confusion is always the product’s fault",
    context:
      "Shipped crypto onboarding to people who don’t think in blockchain. The product was complex. The experience could not be.",
  },
  {
    year: "2024",
    conviction: "What you remove is the design",
    context:
      "Stopped treating clarity as a quality of good work. Started treating it as the work itself.",
  },
] as const

const TOOLS = [
  { name: "Figma", why: "Where ideas become testable" },
  { name: "Claude", why: "Where ambiguity becomes structure" },
  { name: "Cursor", why: "Where design becomes real" },
  { name: "Linear", why: "Where intention becomes momentum" },
] as const

const READING = [
  { title: "The Heart of the Buddha’s Teaching", author: "Thich Nhat Hanh" },
  { title: "The Shape of Design", author: "Frank Chimero" },
  { title: "Thinking in Systems", author: "Donella Meadows" },
] as const

/* ─────────────────────────────────────────────
   Page
   ───────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <AboutClient 
        dashboardFirstImage={dashboardFirstImage}
        chapters={CHAPTERS}
        tools={TOOLS}
        reading={READING}
      />
    </main>
  )
}
