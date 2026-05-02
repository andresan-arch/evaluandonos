---
name: Modern Educational Analytics
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd8e5'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2ff'
  surface-container: '#f0ecf9'
  surface-container-high: '#eae6f4'
  surface-container-highest: '#e4e1ee'
  on-surface: '#1b1b24'
  on-surface-variant: '#464555'
  inverse-surface: '#302f39'
  inverse-on-surface: '#f3effc'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed01b'
  on-secondary-container: '#6f5900'
  tertiary: '#7e3000'
  on-tertiary: '#ffffff'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#eec200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#fcf8ff'
  on-background: '#1b1b24'
  surface-variant: '#e4e1ee'
typography:
  display-stat:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-safe: 24px
  gutter: 16px
  card-padding: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system focuses on "Clarity through Depth," blending a professional educational aesthetic with modern, tactile interfaces. The target audience consists of educators and students who require complex statistical data presented in an approachable, mobile-first format. 

The visual style is **Glassmorphism**, utilizing translucent layers to maintain a sense of hierarchy without overwhelming the user. It evokes an emotional response of trust, intelligence, and modern efficiency, ensuring that statistical analysis feels like a seamless, high-tech experience rather than a cold academic chore.

## Colors
The palette is led by **Indigo (#4f46e5)**, conveying authority and focus. **Yellow (#facc15)** acts as a high-energy accent for interactive highlights and pedagogical cues. Functional colors for success and error follow standard semantic patterns but are tuned for high legibility against translucent backgrounds.

The background uses a soft, cool-toned gradient to provide depth for the glassmorphism effects. Use pure white only for high-contrast text or specific button labels to ensure maximum accessibility.

## Typography
This design system utilizes **Plus Jakarta Sans** (as the closest high-quality match for the desired geometric 'Outfit' aesthetic). The hierarchy prioritizes numerical data; the `display-stat` style is specifically engineered for large-scale percentages and averages in report cards.

Headlines should remain bold and concise, while body text uses a slightly increased line height to improve readability on mobile screens. All labels related to data points should use the `label-caps` style for clear categorization.

## Layout & Spacing
The layout follows a **fluid mobile grid** with a focus on vertical scrolling. A standard 4-column structure is used for internal card elements, while the main container utilizes a 24px safe-area margin to ensure content doesn't feel cramped.

The spacing rhythm is based on an 8px scale, ensuring consistent alignment between statistical charts and their descriptive text. Elements are grouped in "Report Blocks," where cards are separated by a 32px vertical gap to signify distinct data sets.

## Elevation & Depth
Depth is achieved through **Glassmorphism**. Surfaces use a background blur (12px to 20px) with a semi-transparent white fill (opacity 60-80%). 

To define the edges of cards, use a 1px solid border with 20% white opacity. Shadows should be long and diffused (15% opacity of the primary indigo or a neutral slate) to simulate a floating effect over the background textures. This multi-layered approach ensures that data cards remain legible regardless of the underlying background gradient.

## Shapes
In alignment with a modern mobile aesthetic, the shape language is distinctly friendly and smooth. All primary report cards and data containers must utilize a **24px corner radius** (`rounded-xl` equivalent in this scale). 

Buttons and input selectors follow a slightly more compact radius (16px) to maintain a distinct visual identity from the cards they inhabit. Interactive "tactile" elements should feel substantial and easy to tap, avoiding sharp corners entirely.

## Components
- **Report Cards:** The core unit. High-blur glass surfaces containing a headline, a large `display-stat`, and a supporting micro-chart.
- **Tactile Selectors:** Large, thumb-friendly toggle buttons and dropdowns with a subtle inner shadow to indicate interactability.
- **Statistical Charts:**
    - *Bar Charts:* Rounded caps on bars, using Indigo for primary data and Grey for background tracks.
    - *Pie Charts:* Donut-style with a center label for the primary metric.
- **Primary Buttons:** Solid Indigo fill with a slight glow effect (subtle drop shadow in the primary color).
- **Trend Indicators:** Small pill-shaped chips using Green (Success) or Red (Error) to show percentage growth or decline, placed within the report cards.
- **Input Fields:** Semi-transparent backgrounds with a bold bottom border or a subtle 1px outline that glows Indigo when focused.