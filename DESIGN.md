# Design Brief

## Direction

BabyAPI — Premium developer SaaS dashboard for API management and authentication. Dark-first modern aesthetic with vibrant blue primary and purple accents, inspired by Vercel/Linear/Stripe dashboard design language.

## Tone

Clean minimalist elegance with intentional depth. No decoration, high information density, trust through restraint and precision. Premium dev-tool aesthetic executing with conviction.

## Differentiation

Blue-to-purple gradient accent used sparingly on CTAs and focus states creates visual breadcrumbs; glassmorphic cards with subtle borders elevate surfaces without visual noise.

## Color Palette

| Token      | OKLCH           | Role                           |
|------------|-----------------|--------------------------------|
| background | 0.08 0.005 260  | deep charcoal base (dark mode) |
| foreground | 0.94 0.012 260  | high-contrast text             |
| card       | 0.14 0.008 260  | elevated surfaces, glassmorphic|
| primary    | 0.72 0.24 254   | vibrant blue, interactive      |
| accent     | 0.65 0.22 310   | purple, highlights & premium   |
| muted      | 0.18 0.008 260  | secondary backgrounds          |
| destructive| 0.62 0.21 25    | clinical red, errors           |

## Typography

- Display & Body: Figtree — unified geometric sans, 300–700 weights for hierarchy
- Mono: JetBrains Mono — code blocks, API endpoints, technical content
- Scale: hero `text-7xl font-bold tracking-tight`, h2 `text-4xl font-bold`, label `text-xs font-semibold tracking-widest uppercase`, body `text-base font-normal`

## Elevation & Depth

Card layering via background tone shifts (card 0.14 > secondary 0.18 > muted 0.18); shadows minimal (subtle 2px for cards, elevated 10px for modals only); glassmorphic cards use backdrop-filter with subtle white borders at 10% opacity.

## Structural Zones

| Zone    | Background      | Border              | Notes                                     |
|---------|-----------------|---------------------|-------------------------------------------|
| Header  | 0.14 card glass | border-b opacity-10 | sticky nav, logo + auth CTAs, blue accent |
| Content | 0.08 background | —                   | alternating card sections, consistent gap |
| Footer  | 0.14 card glass | border-t opacity-10 | symmetric with header, minimal text       |
| Sidebar | 0.14 card glass | border-r opacity-10 | dashboard nav, rounded cards, blue hover  |

## Spacing & Rhythm

Spacious vertical rhythm (8px grid, 24px section gaps, 16px card padding); cards breathe with consistent 8px/16px spacing; mobile-first with min 44px tap targets.

## Component Patterns

- Buttons: rounded-lg, gradient-primary (blue→purple), blue text on hover states, ghost variant for tertiary actions, 44px+ targets
- Cards: rounded-lg, glass treatment (0.14 bg + backdrop-blur + border opacity-10), shadow-subtle, 16px padding, transition-smooth on hover
- Badges: rounded-full, muted background + foreground text, compact (px-2 py-1), uppercase label
- Inputs: rounded-md, bg-0.22, border-opacity-20, focus:ring-primary, focus:ring-2

## Motion

- Entrance: fade-in 0.4s ease-out on page load + staggered card animations
- Hover: transition-smooth on buttons/cards, scale-105 for cards, shadow elevation
- Decorative: none (focus entirely on functional clarity and interaction feedback)

## Constraints

- No full-page gradients or decorative overlays
- Blue accent only on interactive elements (buttons, focus states, hover)
- Purple accent limited to premium highlights (CTAs, badges)
- Maintain 7:1+ contrast on all text; use lightness tuning, never opacity-based contrast
- Glassmorphism only on surfaces (cards, header), never on text

## Signature Detail

Glassmorphic cards with blue-to-purple gradient CTAs — premium refinement through restraint, not decoration; every visual choice serves functional clarity and user navigation through the API dashboard.
