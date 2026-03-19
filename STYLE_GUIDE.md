# An Nguyen Portfolio — Style Guide

> Extracted from Framer project `35026f80cf201b0d` ("An Nguyen Portfolio Final")
> Last updated: March 2026

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border Radius](#5-border-radius)
6. [Borders](#6-borders)
7. [Breakpoints & Responsive](#7-breakpoints--responsive)
8. [Motion & Animation](#8-motion--animation)
9. [Component Inventory](#9-component-inventory)
10. [CSS Custom Properties Reference](#10-css-custom-properties-reference)
11. [Tailwind Config](#11-tailwind-config)

---

## 1. Design Philosophy

This portfolio follows a **refined minimalist** approach with strong editorial roots:

- **Warm neutrals** as the canvas, accented by a bold primary blue and an energetic flame orange
- **Coconat** as the signature typeface — soft, rounded, modern serif that feels approachable yet professional
- **Generous whitespace** with deliberate, slow-reveal animations
- **Card-based layout** with consistent 16px border-radius as the dominant shape language
- **No box-shadows** — depth is created through color contrast, borders, and layered animations
- **3-tier responsive** — phone-first with tablet and desktop breakpoints

---

## 2. Color System

### 2.1 Core Palette

| Token Name         | CSS Variable               | Value                       | Hex       | Usage                                    |
|--------------------|----------------------------|-----------------------------|-----------|------------------------------------------|
| **Primary**        | `--unframer-primary`       | `rgb(0, 74, 173)`          | `#004AAD` | Brand color, headings, text, buttons, CTAs |
| **Flame Orange**   | `--unframer-flame-orange`  | `rgb(228, 70, 25)`         | `#E44619` | Accent, hover states, active indicators  |
| **Secondary**      | `--unframer-secondary`     | `rgb(246, 244, 240)`       | `#F6F4F0` | Page background, card fills, off-white   |
| **Light (White)**  | `--unframer-light`         | `rgb(255, 255, 255)`       | `#FFFFFF` | Pure white, navigation bg, card bg       |

### 2.2 Border Colors

| Token Name         | CSS Variable               | Value                       | Hex       | Usage                                    |
|--------------------|----------------------------|-----------------------------|-----------|------------------------------------------|
| **Border 1**       | `--unframer-border-1`      | `rgb(221, 227, 233)`       | `#DDE3E9` | Primary border, card outlines, nav       |
| **Border 2**       | `--unframer-border-2`      | `rgb(204, 219, 239)`       | `#CCDBEF` | Secondary border, decorative             |
| **Border 3**       | `--unframer-border-3`      | `rgb(178, 201, 230)`       | `#B2C9E6` | Light blue accents, dividers, decorative |

### 2.3 Opacity Variants

| Token Name         | CSS Variable               | Value                       | Usage                                    |
|--------------------|----------------------------|-----------------------------|------------------------------------------|
| **Light 10%**      | `--unframer-light-10`      | `rgba(255, 255, 255, 0.1)` | Subtle overlay, glass effect             |
| **Light 20%**      | `--unframer-light-20`      | `rgba(255, 255, 255, 0.2)` | Footer separators, translucent borders   |

### 2.4 Functional Colors

| Role               | Value                       | Hex       | Usage                                    |
|--------------------|-----------------------------|-----------|------------------------------------------|
| **Placeholder**    | `rgb(153, 153, 153)`       | `#999999` | Input placeholder text, muted icons      |
| **Link**           | `rgb(0, 153, 255)`         | `#0099FF` | Footer links (dark variant)              |
| **Status Glow**    | `rgba(254, 86, 11, 0.1)`  | —         | Available status pulsing indicator       |

### 2.5 Color Usage Rules

```
Background hierarchy:
  Page        → Secondary (#F6F4F0)
  Card        → White (#FFFFFF) or Primary (#004AAD) for dark cards
  Navigation  → White (#FFFFFF) with border
  Footer      → Primary (#004AAD) dark section

Text hierarchy:
  Headings    → Primary (#004AAD)
  Body        → Primary (#004AAD)
  On Dark BG  → Secondary (#F6F4F0) or White (#FFFFFF)
  Muted       → Placeholder (#999999)

Interactive states:
  Default     → Primary (#004AAD) border/text
  Hover       → Flame Orange (#E44619) border/text
  Active      → Flame Orange (#E44619)
```

---

## 3. Typography

### 3.1 Font Stack

| Font               | Category        | Weight(s)    | Source           | Role                                     |
|--------------------|-----------------|--------------|------------------|------------------------------------------|
| **Coconat**        | Rounded Serif   | 400, 700     | Framer Built-in  | Primary — headings, body, UI elements    |
| **Inter**          | Sans-serif      | 400, 700     | Framer-hosted    | Secondary — buttons, labels, captions    |
| **Instrument Serif** | Serif (Italic) | 400         | Google Fonts     | Decorative — h5 headings, editorial flair |
| **IBM Plex Mono**  | Monospace       | 400          | Google Fonts     | Utility — time display, location text    |

### 3.2 Type Scale

| Level  | Font           | Size (Desktop) | Size (Tablet) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|--------|----------------|----------------|---------------|---------------|--------|-------------|----------------|
| **H2** | Coconat        | 40px           | 32px          | 26px          | 400    | 120%        | -0.04em        |
| **H3** | Coconat        | 32px           | 28px          | 22px          | 400    | 150%        | -0.04em        |
| **H4** | Coconat        | 24px           | 24px          | 20px          | 400    | 150%        | -0.04em        |
| **H5** | Instrument Serif | 20px         | 20px          | 18px          | 400    | 120%        | -0.04em        |
| **Body** | Coconat      | 16px           | 16px          | 16px          | 400    | 160%        | -0.04em        |
| **Body Bold** | Coconat | 16px          | 16px          | 16px          | 700    | 160%        | -0.04em        |
| **Tag/Label** | Coconat | 16px          | 16px          | 16px          | 400    | 150%        | -0.04em        |
| **Button** | Inter      | 16px           | 16px          | 16px          | 400    | 160%        | -0.04em        |
| **Button SM** | Inter  | 14px           | 14px          | 14px          | 400    | 150%        | -0.04em        |
| **Brand** | Coconat    | 21px           | 21px          | 21px          | 700    | —           | -0.04em        |
| **Logo** | Coconat     | 48px           | —             | —             | 400    | —           | -0.04em        |
| **Mono** | IBM Plex Mono | 16px         | 16px          | 16px          | 400    | 160%        | -0.04em        |

### 3.3 Typography Rules

- **Letter spacing** is universally `-0.04em` across every text style — this is a defining characteristic of the design
- **Text transform**: Only `uppercase` for section tags/labels; everything else is `none`
- **Headings use regular weight (400)** — the Coconat typeface carries enough visual weight on its own
- **Bold (700)** is reserved for brand name, navigation logo, and emphasized body text
- **H5 uses Instrument Serif** to create typographic contrast and editorial personality

### 3.4 CSS Preset Classes

| Preset Class               | Maps To | Description                    |
|----------------------------|---------|--------------------------------|
| `.framer-styles-preset-pyrh9q`  | H2     | Coconat 40/32/26px, 120% LH   |
| `.framer-styles-preset-1oed8xl` | H3     | Coconat 32/28/22px, 150% LH   |
| `.framer-styles-preset-1sgo5u0` | H4     | Coconat 24/24/20px, 150% LH   |
| `.framer-styles-preset-1e3szrq` | H5     | Instrument Serif 20/20/18px    |
| `.framer-styles-preset-17e0ml2` | Body   | Coconat 16px, 160% LH         |
| `.framer-styles-preset-upvz9u`  | Bold   | Coconat Bold 16px, 160% LH    |
| `.framer-styles-preset-52w0bu`  | Tag    | Coconat 16px, uppercase, 150% |
| `.framer-styles-preset-w7ljd5`  | Inter  | Inter 16px, 160% LH           |

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

The design uses a **non-rigid but consistent** spacing system. These are all values extracted from the components:

| Token   | Value  | Common Usage                                        |
|---------|--------|-----------------------------------------------------|
| `4xs`   | 4px    | Feature list gaps, tight stacks                     |
| `3xs`   | 6px    | Pill padding (vertical), compact gaps               |
| `2xs`   | 8px    | Feature item gaps, button inner gaps, icon spacing   |
| `xs`    | 10px   | **Default gap** — most component root gaps           |
| `sm`    | 12px   | Section tag gaps, tablet card padding, border-radius |
| `md`    | 16px   | Card padding (compact), nav link gaps, pill padding (h) |
| `lg`    | 20px   | Content padding, column gaps, nav bar (tablet)       |
| `xl`    | 24px   | Card content padding, card-to-card gaps, service card inner |
| `2xl`   | 28px   | Content padding (desktop), testimonial gaps          |
| `3xl`   | 32px   | Achievement card padding, button border-radius       |
| `4xl`   | 40px   | Large section gaps, text content gaps                |
| `5xl`   | 48px   | Award card vertical padding                          |
| `6xl`   | 60px   | Phone menu top padding                               |
| `7xl`   | 100px  | Desktop menu inner padding                           |

### 4.2 Layout Principles

- **Flexbox everywhere** — no CSS Grid, no absolute positioning (except overlays)
- **Gap-based spacing** — margins are essentially unused; spacing comes from `gap` and `padding`
- **Max-width constraint**: `1200px` for navigation and main content
- **Card widths** follow component-specific sizing, not a grid system

### 4.3 Key Layout Dimensions

| Component                  | Desktop     | Tablet      | Phone       |
|----------------------------|-------------|-------------|-------------|
| Navigation (max-width)     | 1200px      | 100%        | 100%        |
| Navigation (height)        | 86px        | —           | —           |
| Case Study Card Large      | 936 × 436px | 618px       | 310px       |
| Case Study Latest Project  | 456 × 644px | —           | —           |
| Blog Card                  | 454 × 574px | —           | —           |
| Service Cards              | 546 × 384px | —           | 350px       |
| Testimonial Card           | 550 × 446px | —           | —           |
| Award Card                 | 744 × 222px | —           | —           |
| Statistics Card            | 248 × 300px | —           | —           |
| Contact Section            | 936 × 458px | —           | —           |
| Footer                     | 1200 × 524px| —           | —           |
| Hero Card (bottom)         | 188 × 204px | 185 × 201px | —           |

---

## 5. Border Radius

| Token    | Value  | Usage                                                 |
|----------|--------|-------------------------------------------------------|
| `sm`     | 8px    | Images, form fields, small cards, default radius      |
| `md`     | 12px   | TimeDisplay container                                 |
| `lg`     | 16px   | **Primary** — cards, image wrappers, content areas    |
| `xl`     | 20px   | Navigation bar, menu burger container                 |
| `2xl`    | 32px   | Pills/tags, primary button                            |

### Radius Rules
- **16px is the dominant radius** — used for all major cards and content containers
- **32px for pill shapes** — buttons, tag chips, year labels
- **8px for secondary elements** — images, form inputs, smaller cards
- **20px for navigation** — the main nav bar

---

## 6. Borders

### Border Styles
- **1px solid** — standard for all borders
- **1px dashed** — footer social links only
- **No box-shadows** — the design achieves depth through color and animation, not shadows

### Border Patterns

| Pattern                         | Color                      | Components                              |
|---------------------------------|----------------------------|-----------------------------------------|
| Card outline                    | `--unframer-border-1`      | Hero card, navigation                   |
| Primary interactive             | `--unframer-primary`       | Buttons, focused inputs                 |
| Hover state                     | `--unframer-flame-orange`  | Buttons on hover                        |
| Decorative divider              | `--unframer-border-3`      | Statistics card, award card             |
| On-dark separator               | `--unframer-light-20`      | Footer borders                          |
| Tag/pill border                 | `--unframer-secondary`     | Case study tags                         |
| Dashed social link              | `--unframer-secondary`     | Footer social links                     |

---

## 7. Breakpoints & Responsive

### 7.1 Breakpoint System

| Name          | Range              | CSS                              | Framer Key |
|---------------|--------------------|----------------------------------|------------|
| **Phone**     | 0 — 809px          | `max-width: 809px`              | `base`     |
| **Tablet**    | 810px — 1199px     | `min-width: 810px`              | `md`       |
| **Desktop**   | 1200px+            | `min-width: 1200px`             | `xl`       |

### 7.2 Responsive Visibility Classes

```css
.unframer-hidden:not(.unframer-base)  /* 0–319px    */
.unframer-hidden:not(.unframer-sm)    /* 320–767px  */
.unframer-hidden:not(.unframer-md)    /* 768–959px  */
.unframer-hidden:not(.unframer-lg)    /* 960–1199px */
.unframer-hidden:not(.unframer-xl)    /* 1200–1535px */
.unframer-hidden:not(.unframer-2xl)   /* 1536px+    */
```

### 7.3 Responsive Strategy

- **Phone-first base** with progressive enhancement
- Typography scales down: H2 goes from 40px → 32px → 26px
- Card layouts shift from horizontal to vertical stacking
- Navigation collapses to hamburger menu on tablet/phone
- Padding reduces on smaller screens (28px → 20px → 12px)
- Some animations are disabled on mobile (instant `tween 0s` transitions)

---

## 8. Motion & Animation

### 8.1 Animation Philosophy

The design uses **Framer Motion springs** for organic, physical-feeling animations. No harsh linear or ease-out transitions. Animations are **scroll-triggered** (whileInView) with staggered delays to create a cascading reveal effect.

### 8.2 Spring Presets

| Name              | Type   | Duration | Bounce | Delay  | Usage                                |
|-------------------|--------|----------|--------|--------|--------------------------------------|
| **Standard**      | spring | 0.4s     | 0.2    | 0s     | Quick UI interactions (buttons, cards) |
| **Smooth**        | spring | 1.0s     | 0      | 0s     | Major content reveals                |
| **Fast**          | spring | 0.6s     | 0      | 0s     | Navigation, menu transitions         |
| **Medium**        | spring | 0.8s     | 0      | 0s     | Service cards, blog cards            |
| **Bouncy**        | spring | 0.65s    | 0.25   | 0.1s   | Playful accents (statistics)         |

### 8.3 Stagger Delays

Content sections use cascading delays for visual storytelling:

```
Element 1: 0.0s delay
Element 2: 0.1s delay
Element 3: 0.2s delay
Element 4: 0.4s delay
Element 5: 0.5s delay
Element 6: 0.6s delay
Element 7: 0.7s delay
```

### 8.4 Tween Presets

| Name              | Duration | Easing                      | Usage                            |
|-------------------|----------|-----------------------------|----------------------------------|
| **Instant**       | 0s       | —                           | Mobile fallback (no animation)   |
| **Eased**         | 0.5s     | `cubic-bezier(0.44, 0, 0.56, 1)` | Image carousel transitions |
| **Eased Slow**    | 1.0s     | `cubic-bezier(0.44, 0, 0.56, 1)` | About image reveal          |

### 8.5 Common Animation Patterns

| Pattern                | From              | To                  | Trigger      |
|------------------------|-------------------|---------------------|--------------|
| **Fade Up**            | opacity: 0, y: 20 | opacity: 1, y: 0   | whileInView  |
| **Fade In**            | opacity: 0        | opacity: 1          | whileInView  |
| **Scale In**           | scale: 0.95       | scale: 1            | whileInView  |
| **Slide Left/Right**   | x: ±40            | x: 0                | whileInView  |
| **Status Blink**       | opacity pulse      | repeating           | infinite loop |

---

## 9. Component Inventory

### 9.1 Navigation & Structure

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `navigation`                  | Main nav bar with logo, links, hamburger menu    |
| `nav-links`                   | Navigation link items                            |
| `nav-links-contact`           | Contact-specific nav links                       |
| `nav-links-social`            | Social media nav links                           |
| `menu-burger`                 | Hamburger menu icon (animated)                   |
| `star-navigation`             | Star-shaped navigation element                   |
| `footer`                      | Full footer with links, social, copyright        |

### 9.2 Hero & Landing

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `star-hero`                   | Star-shaped hero decoration                      |
| `hero-card-bottom`            | Hero section bottom card with features/time      |
| `available-status-animated`   | Animated "Available" status indicator             |
| `time-display`                | Real-time clock/location display (IBM Plex Mono) |

### 9.3 Content & Case Studies

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `case-study-hero-animated`    | Animated case study hero image                   |
| `case-study-card-large`       | Full-width case study card                       |
| `case-study-card-hero-small`  | Small hero case study card                       |
| `case-study-card-latest-project` | Featured latest project card                  |
| `reveal-overlay-case-study-image` | Overlay reveal animation for case studies    |

### 9.4 About & Achievements

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `about-image-reveal`          | Animated image reveal for about section          |
| `achievement-card`            | Single achievement card                          |
| `achievement-cards-animated`  | Animated group of achievement cards              |
| `statistics-card`             | Statistics/metrics display card                  |
| `award-card`                  | Award/recognition card                           |

### 9.5 Services & Content

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `service-card`                | Individual service card                          |
| `service-cards`               | Service cards group/container                    |
| `blog-card`                   | Blog post preview card                           |
| `blog-hover-button`           | Blog card hover interaction button               |
| `testimonial-card`            | Client testimonial card                          |

### 9.6 UI Elements

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `button-primary`              | Primary CTA button (32px radius, blue/orange)    |
| `button-secondary-large`      | Large secondary button                           |
| `button-secondary-small`      | Small secondary button (14px text)               |
| `submit-button`               | Form submit button                               |
| `section-tag`                 | Uppercase section label/tag (marquee ticker)     |
| `contact`                     | Contact form section                             |

### 9.7 Animation & Decoration

| Component                     | Description                                      |
|-------------------------------|--------------------------------------------------|
| `text-reveal`                 | Text reveal animation                            |
| `text-reveal-1`               | Text reveal animation (variant)                  |
| `line-animation`              | Animated decorative line                         |
| `image-carousel`              | Image carousel/slider                            |

---

## 10. CSS Custom Properties Reference

```css
:root {
  /* Core Colors */
  --unframer-primary:      rgb(0, 74, 173);      /* #004AAD */
  --unframer-flame-orange:  rgb(228, 70, 25);     /* #E44619 */
  --unframer-secondary:    rgb(246, 244, 240);    /* #F6F4F0 */
  --unframer-light:        rgb(255, 255, 255);    /* #FFFFFF */

  /* Borders */
  --unframer-border-1:     rgb(221, 227, 233);    /* #DDE3E9 */
  --unframer-border-2:     rgb(204, 219, 239);    /* #CCDBEF */
  --unframer-border-3:     rgb(178, 201, 230);    /* #B2C9E6 */

  /* Opacity */
  --unframer-light-10:     rgba(255, 255, 255, 0.1);
  --unframer-light-20:     rgba(255, 255, 255, 0.2);
}
```

---

## 11. Tailwind Config

Recommended Tailwind configuration to match this design system:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:      "rgb(0, 74, 173)",
        orange:       "rgb(228, 70, 25)",
        secondary:    "rgb(246, 244, 240)",
        light:        "rgb(255, 255, 255)",
        border: {
          1: "rgb(221, 227, 233)",
          2: "rgb(204, 219, 239)",
          3: "rgb(178, 201, 230)",
        },
        placeholder:  "rgb(153, 153, 153)",
        link:         "rgb(0, 153, 255)",
      },
      fontFamily: {
        coconat:     ["Coconat", "sans-serif"],
        inter:       ["Inter", "Inter Placeholder", "sans-serif"],
        instrument:  ["Instrument Serif", "Instrument Serif Placeholder", "serif"],
        mono:        ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        h2:     ["40px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        h3:     ["32px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        h4:     ["24px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        h5:     ["20px", { lineHeight: "120%", letterSpacing: "-0.04em" }],
        body:   ["16px", { lineHeight: "160%", letterSpacing: "-0.04em" }],
        sm:     ["14px", { lineHeight: "150%", letterSpacing: "-0.04em" }],
        brand:  ["21px", { letterSpacing: "-0.04em" }],
        logo:   ["48px", { letterSpacing: "-0.04em" }],
      },
      borderRadius: {
        sm:  "8px",
        md:  "12px",
        lg:  "16px",
        xl:  "20px",
        pill: "32px",
      },
      screens: {
        phone:  { max: "809px" },
        tablet: "810px",
        desktop: "1200px",
      },
      maxWidth: {
        content: "1200px",
      },
      letterSpacing: {
        tight: "-0.04em",
      },
    },
  },
  plugins: [],
}
```

---

## Quick Reference Card

```
COLORS        Primary #004AAD │ Orange #E44619 │ BG #F6F4F0 │ White #FFF
FONTS         Coconat (main) │ Inter (UI) │ Instrument Serif (h5) │ IBM Plex Mono (mono)
TRACKING      -0.04em everywhere
RADIUS        8 │ 12 │ 16 │ 20 │ 32
BREAKPOINTS   Phone <810 │ Tablet 810-1199 │ Desktop 1200+
MOTION        Springs (0.4-1.0s) │ Stagger delays (0-0.7s) │ No animation on mobile
SHADOWS       None — depth via color/border/animation
```
