export const SITE = {
  name: 'Leon Nguyen',
  title: 'Leon Nguyen — Portfolio',
  description:
    'Designer & Developer crafting meaningful digital experiences.',
  email: 'leondesigner221@gmail.com',
  phone: '+849 88 67 97 65',
} as const

export const CONTACT = {
  email: SITE.email,
  emailLink: `mailto:${SITE.email}`,
  phone: SITE.phone,
  phoneLink: `tel:${SITE.phone}`,
  headline:
    "You bring the vision. I'll bring the pixels. Let's talk",
} as const

export const ABOUT_TEXT = {
  reveal1:
    "A decade in this industry teaches you which trends matter and which ones are just noise. I've done the full loop more times than I can count, from <b>research and wireframes</b> to <b>production code</b> and <b>post-launch firefighting</b>.",
  reveal2:
    "These days I work in <b>Figma</b>, <b>Cursor</b>, <b>Claude Code</b>, and <b>Codex</b>. I picked them the same way I pick everything: try it, break it, keep what earns its place. The tools keep changing. The instinct for what makes a product actually work doesn't.",
} as const

export const SECTION_IDS = {
  hero: 'hero',
  about: 'about',
  services: 'services',
  work: 'work',
  testimonials: 'testimonials',
  blog: 'blog',
  contact: 'contact',
} as const

export const TESTIMONIALS = {
  quote:
    'Leon turns minimal requirements into fully realized products. His AI-enhanced workflow effectively replaced the need for a dedicated frontend engineering team.\n',
  author:
    'Sowmya Raghavan, Venture Builder & Product Strategy\n',
} as const

export const CASE_STUDY = {
  year: '2025',
  title:
    'Crafting Orris\u00e9: An Immersive Study in Fragrance Identity',
  accentColor:
    'var(--token-1615e446-4914-429c-9d6b-de0d358636dc, rgb(0, 74, 173))',
  slug: '/case-study/orrise',
  description: 'Branding',
} as const

export const BLOG = {
  slug: '/blog/:slug',
  featuredTitle:
    'Design Beyond Aesthetics: How Strategy Shapes Meaningful Brands',
} as const
