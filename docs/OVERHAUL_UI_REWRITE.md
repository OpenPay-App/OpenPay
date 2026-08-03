# UI Overhaul Rewrite Plan

## Overview

Transition the merchant-dashboard app (and its marketing landing page) from the current dark-themed Next.js/Tailwind UI to a pixel-perfect match of the Stripe API Replica Webflow clone (`stripe_api_replica_2018.webflow.io`). This includes color scheme, typography, layout, animations, logo, code blocks, sticky behavior, scroll-triggered reveals, and all interactive patterns.

---

## 1. Color Scheme Migration

### Current (Dark Theme) → Target (Light Theme)

| Token | Current Value | Target Value | Where Changed |
|---|---|---|---|
| `--color-surface` | `#000000` | `#ffffff` | `globals.css` `@theme` |
| `--color-bg-alt` | `#0a0a0a` | `#fafafa` | `globals.css` `@theme` |
| `--color-bg-dark` | `#000000` | `#ffffff` | `globals.css` `@theme` |
| `--color-text-primary` | `#f5f5f5` | `#333333` | `globals.css` `@theme` |
| `--color-text-secondary` | `#a0a0a0` | `#999999` | `globals.css` `@theme` |
| `--color-text-muted` | `#666666` | `#AAADB0` | `globals.css` `@theme` |
| `--color-border` | `#1f1f1f` | `#e2e2e2` / `#cccccc` | `globals.css` `@theme` |
| `--color-secondary` | `#F56600` | `#3898EC` (Stripe blue) | `globals.css` `@theme` |
| `--color-secondary-hover` | `#e05c00` | `#2c7dd6` | `globals.css` `@theme` |
| `--color-secondary-light` | `#2a1400` | `#e8f0fe` | `globals.css` `@theme` |
| `--color-accent` | `#FFC60A` | `#40d63b` (Stripe green) | `globals.css` `@theme` |
| `--color-accent-light` | `#2a2400` | `#e6f9e6` | `globals.css` `@theme` |
| `--color-success` | `#10b981` | `#40d63b` | `globals.css` `@theme` |
| `--color-warning` | `#f59e0b` | `#f59e0b` (keep) | `globals.css` `@theme` |
| `--color-error` | `#ef4444` | `#ea384c` | `globals.css` `@theme` |

### Body Background
- **Current**: `background: var(--color-surface)` → black
- **Target**: `background: #ffffff`
- **File**: `globals.css` `body` rule

### Body Text Color
- **Current**: `color: var(--color-text-primary)` → `#f5f5f5`
- **Target**: `color: #333333`

### Scrollbar (Dark → Light)
- **Current**: Track `#000000`, Thumb `#333`
- **Target**: Track `#f5f5f5`, Thumb `#cccccc`

---

## 2. Typography Migration

### Font Families

| Element | Current | Target |
|---|---|---|
| Body text | `"Inter", system-ui, -apple-system, sans-serif` | `Arial, sans-serif` |
| Code / monospace | Inherited (monospace) | `"Inconsolata", monospace` |
| Headings (h1-h5) | Inherited (Inter) | `Oxygen, sans-serif` |

### Google Fonts
- **Remove**: `Inter` (via `fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700`)
- **Add**: `Oxygen` (300, regular, 700) + `Inconsolata` (400, 700)
- **Method**: Use the Webfont loader script (same as Webflow site) OR add to `layout.tsx` `<head>`:
  ```html
  <link href="https://fonts.googleapis.com/css2?family=Oxygen:wght@300;400;700&family=Inconsolata:wght@400;700&display=swap" rel="stylesheet" />
  ```

### Tailwind Config
- Remove `Inter` from Tailwind theme
- Add `Oxygen` as heading font and `Inconsolata` as mono font
- Update `tailwind.config.ts` (or `tailwind.config.js`) fontFamily:
  ```js
  fontFamily: {
    sans: ['Oxygen', 'Arial', 'sans-serif'],
    mono: ['Inconsolata', 'monospace'],
  }
  ```

---

## 3. Layout Structure Overhaul

### 3.1 Root Layout (`layout.tsx`)

**Current**:
```tsx
<body className="bg-surface text-text-primary">
  <AuthProvider>{children}</AuthProvider>
</body>
```

**Target**:
```tsx
<body className="bg-white text-gray-800 font-sans">
  <AuthProvider>{children}</AuthProvider>
</body>
```

### 3.2 Page Wrapper Architecture

The Webflow site uses a **`page-wrap` > `sidebar-wrap` + `sections-wrap`** pattern. The app currently uses a **fixed sidebar + topbar + main content** pattern.

**Target structure for internal pages (dashboard, docs, settings, etc.)**:

```html
<div class="page-wrap">
  <div class="sidebar-wrap">
    <div class="sidebar-menus-sticky">
      <!-- Brand logo -->
      <!-- Collapsible nav groups -->
    </div>
  </div>
  <div class="sections-wrap">
    <!-- Page content -->
  </div>
</div>
```

**Key differences from current**:
- Remove the fixed topbar (search bar, sandbox toggle, user avatar) — the Webflow site has no topbar on internal pages
- Sidebar is `position: sticky; top: 10px` (not `fixed`)
- Sidebar width: ~200-250px (not `w-64` = 16rem)
- No logout button in sidebar footer (Webflow site has none)
- Sidebar nav items are text-only (no icons)
- Sidebar nav groups are collapsible with arrow indicators

### 3.3 Sidebar Component (`sidebar.tsx`) — Full Rewrite

**Current**: Fixed sidebar, 240px wide, icon+text nav items, orange active indicator, logout button

**Target**:
- `position: sticky; top: 10px;` (not fixed)
- Width: `min-width: 200px; flex: 0 auto;`
- Background: `#ffffff` (white, not black)
- Border right: `1px solid #e2e2e2`
- Text color: `#333333` (not white)
- Active state: `background-color: rgba(85, 108, 214, 0.05); color: #556cd6;` (blue, not orange)
- Hover state: `color: #141f41;` (dark blue, not white)
- Nav items: text-only, no icons, `padding: 4px 12px;`
- Nav groups: collapsible with arrow icons that rotate 90deg when expanded
- Section headings: `h5` with `font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #999;`
- No logout section at bottom

**HTML structure per nav group**:
```html
<div class="sidebar-nav-group">
  <a href="#top_section-APIReference" class="sidebar-nav-heading w-inline-block">
    <h5 class="sidebar-nav-heading-text">API Reference</h5>
    <img src="arrow-icon.svg" alt="" class="nav-arrow" />
  </a>
  <ul role="list" class="sidebar-nav-items">
    <li><a href="#method-API_Reference" class="sidebar-nav-item">API Reference</a></li>
    <li><a href="#method-Authentication" class="sidebar-nav-item">Authentication</a></li>
  </ul>
</div>
```

### 3.4 Topbar Removal (Internal Pages)

The Webflow clone has **no topbar** on internal documentation pages. The app's `topbar.tsx` (search bar, sandbox toggle, notifications, user avatar) should be **removed from all internal pages** that match the Webflow clone's layout.

The topbar should only remain on the marketing landing page (if at all).

---

## 4. Landing Page Overhaul (`page.tsx` + marketing components)

### 4.1 Hero Section (`hero.tsx`)

**Current**: Dark black background, orange accent orbs, grid pattern, Inter font, scroll-reveal animations

**Target**: Match the Webflow site's hero section (the landing page of the Stripe API Replica):
- Background: `#ffffff` (white)
- Primary text: `#333333`
- Accent: Stripe blue `#3898EC` for links and CTAs
- Font: `Oxygen` for headings, `Arial` for body
- Layout: Centered, single-column, clean
- No gradient orbs or grid patterns
- CTA button style: Stripe blue `#3898EC` background, white text, `border-radius: 0` (no rounded corners)
- Button padding: `9px 15px` (Webflow standard)
- Font size: `16px` base

### 4.2 Features Section (`features.tsx`)

**Current**: Dark cards with glass morphism, orange accents

**Target**:
- Background: `#fafafa` (light gray)
- Cards: white `#ffffff`, `border: 1px solid #cccccc`, `box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)`
- No glass morphism
- Icons: Stripe blue `#3898EC`
- Text: `#333333` for titles, `#999` for descriptions

### 4.3 Pricing Comparison (`pricing-comparison.tsx`)

**Current**: Dark theme cards with orange accent

**Target**:
- Light background `#fafafa`
- Cards: white `#ffffff`, light gray borders
- Highlighted/active plan: Stripe blue border `#3898EC`
- CTA buttons: Stripe blue background, white text

### 4.4 Self-Host Section (`self-host.tsx`)

**Current**: Dark theme

**Target**: Light theme matching the Webflow site's section styling

### 4.5 Open Source Section (`open-source.tsx`)

**Current**: Dark theme

**Target**: Light theme

### 4.6 Footer (`footer.tsx`)

**Current**: Dark theme

**Target**: Light theme, `background-color: #fafafa`, border-top `1px solid #e2e2e2`

---

## 5. Dashboard Page Overhaul (`dashboard/page.tsx`)

### 5.1 KPI Cards

**Current**: `bg-[#0a0a0a] rounded-xl border border-border p-6`

**Target**:
- `background-color: #ffffff`
- `border: 1px solid #cccccc`
- `box-shadow: 0 0 0 1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.1)`
- `border-radius: 3px` (not `rounded-xl`)
- No glass morphism

### 5.2 Revenue Chart (`dashboard-chart.tsx`)

**Current**: Dark card with orange gradient, recharts AreaChart

**Target**:
- Card: white background, light gray border, 3px border-radius
- Chart colors: Stripe blue `#3898EC` for the area stroke
- Grid lines: `#e2e2e2` (light gray)
- Axis text: `#999` (muted gray)
- Tooltip: white background, light gray border, subtle shadow

### 5.3 Transaction Table

**Current**: Dark card, dark header, orange links

**Target**:
- Card: white background, light gray border
- Header: `background-color: #fafafa`, `border-bottom: 1px solid #e2e2e2`
- Row hover: `background-color: #f5f5f5`
- Links: Stripe blue `#3898EC`
- Status badges: Use Stripe's color palette (green for succeeded, red for failed, amber for pending)

### 5.4 Sandbox/Production Toggle

**Current**: Amber (sandbox) / Emerald (production) pills

**Target**: Keep the toggle but update colors:
- Sandbox: `background-color: #fef3c7; border-color: #f59e0b; color: #92400e`
- Production: `background-color: #d1fae5; border-color: #10b981; color: #065f46`

---

## 6. Code Block Implementation (NEW)

The Webflow clone heavily features code blocks with syntax highlighting, line numbers, and language tabs. This is a major addition.

### 6.1 Dependencies

Add to `package.json`:
```json
"prismjs": "^1.29.0",
"prism-themes": "^1.3.0"
```

### 6.2 Prism.js Setup

Import in `layout.tsx` or a client component:
```tsx
import 'prismjs/themes/prism-atom-dark.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/plugins/toolbar/prism-toolbar.css';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/plugins/line-numbers/prism-line-numbers.min.js';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js';
import 'prismjs/plugins/toolbar/prism-toolbar.min.js';
```

### 6.3 Code Block Component

Create `components/code-block.tsx`:
- Wrapper: `pre.line-numbers` class (for line numbers)
- Language tabs: horizontal tab bar with `curl`, `js`, `go`, `python` options
- Active tab: `background-color: #3898EC`, white text
- Inactive tab: `background-color: #39415e`, `#e3e8ee` text
- Hover tab: `background-color: #39415e`, white text
- Code block background: `#1e1e2e` (dark) or `#f8f8f8` (light, matching Webflow)
- Response block: `background-color: #e3e8ee` (light gray, "light" variant)
- Method type badge: `background-color: #40d63b` (green for GET), `#3898EC` (blue for POST), `#ea384c` (red for DELETE), `#f59e0b` (amber for PATCH)
- Method request path: `color: #a3acb9` (muted gray)
- Copy button: `background-color: #f5f2f0` (light gray), `border-radius: 0.5em`, `padding: 0.5em 1em`
- Line numbers: `prism-line-numbers` plugin styling

### 6.4 Language Switcher Tabs

The Webflow site uses `w-tabs` (Webflow's native tab component). Replicate with a custom tab component:

```tsx
<div className="lang-switcher">
  <div className="tabs-menu">
    <button className="lang-switcher-tab-link w--current">curl</button>
    <button className="lang-switcher-tab-link">js</button>
    <button className="lang-switcher-tab-link">go</button>
    <button className="lang-switcher-tab-link">python</button>
  </div>
  <div className="w-tab-content">
    <div className="w-tab-pane w--tab-active">...</div>
  </div>
</div>
```

**Tab styling**:
- Active: `background-color: #3898EC; color: #fff;`
- Inactive: `background-color: transparent; color: #e3e8ee;`
- Hover (inactive): `background-color: #39415e; color: #fff;`
- Min-width: `500px` (desktop), `100px` (mobile)

---

## 7. Sticky Behavior Implementation

### 7.1 Sticky Sidebar

The Webflow sidebar uses `position: sticky; top: 10px;` via `.sidebar-menus-sticky`.

**Implementation**:
```css
.sidebar-menus-sticky {
  position: sticky;
  top: 10px;
}
```

### 7.2 Sticky Section Titles

Each section group title (e.g., "API Reference", "Responses") sticks at the top when scrolling:

```css
.section-title-sticky {
  position: sticky;
  top: 35px; /* desktop */
  background-color: #ffffff;
  z-index: 10;
}
```

Mobile override:
```css
@media (max-width: 767px) {
  .section-title-sticky {
    top: 80px;
  }
}
```

### 7.3 Sticky Headings

The main heading inside each method section sticks below the section title:

```css
.sticky-heading {
  position: sticky;
  top: 70px; /* desktop */
  background-color: #ffffff;
  z-index: 5;
}
```

Mobile override:
```css
@media (max-width: 767px) {
  .sticky-heading {
    top: 80px;
  }
}
```

### 7.4 Sticky Code Examples

The code example panel sticks within its section:

```css
.example-sticky-wrap {
  position: sticky;
  top: 60px;
}
```

---

## 8. Scroll-Triggered Animations

### 8.1 Sidebar Nav Item Reveal

Sidebar nav items start hidden and animate in when their section enters the viewport.

**CSS initial state**:
```css
.sidebar-nav-item {
  opacity: 0;
  transform: translate3d(0, -15px, 0);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.sidebar-nav-item.w--current {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
```

**Implementation**: Use `IntersectionObserver` in a custom React hook (`useScrollReveal.ts`) that adds `w--current` class when elements enter the viewport.

### 8.2 Webflow JS Engine

The Webflow site uses `webflow.5deff4f72.js` for all scroll animations. The key behaviors:

1. **`w-mod-js` class** added to `<html>` element — enables JS-driven styles
2. **`w-mod-ix` class** added to `<html>` element when Webflow interactions are ready — removes the initial hidden states
3. **`data-w-id` attributes** on elements — used by Webflow JS to identify and animate elements
4. **`w-scroll` class** added to `<body>` during scroll — used for scroll-triggered CSS rules
5. **`requestAnimationFrame`** used for smooth 60fps animation loops
6. **`IntersectionObserver`** used for viewport detection

**For the app**: Replace Webflow JS with a custom React hook using `IntersectionObserver`:

```tsx
// hooks/useScrollReveal.ts
export function useScrollReveal(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}
```

---

## 9. Logo and Branding

### 9.1 Logo Change

**Current**: `logo.svg` / `logo-dark.svg` (OpenPay logo — orange gradient with "OpenPay" text)
**Target**: The project's custom SVG logo (the `AVALogo` design provided by the user — a stylized "AVA" text logo with skew transforms and rounded rectangles, viewBox `0 0 1000 400`)

The logo SVG should be saved as `public/brand/logo.svg` (replacing the existing `logo.svg` and `logo-dark.svg`).

**Action**:
1. Save the user's custom SVG as `public/brand/logo.svg` (replacing both `logo.svg` and `logo-dark.svg`)
2. Update all references from `logo-dark.svg` to `logo.svg`
3. The logo should be `width: 60px; padding-right: 10px; padding-left: 15px;` (per Webflow CSS `.brand` rule)
4. The logo background should be white (`#FFFFFF`) with dark fill elements

### 9.2 Remove Webflow Watermark

The `.w-webflow-badge` (the small "Made with Webflow" badge) should be **removed** from the app entirely. It is not part of the Stripe API Replica branding.

### 9.3 Favicon

The Webflow site uses `assets.website-files.com/img/favicon.ico`. The app currently uses `/brand/favicon.svg`. No change needed unless the user wants to match the Webflow favicon exactly.

---

## 10. Component-by-Component Changes

### 10.1 `globals.css` — Complete Rewrite

Replace all dark theme tokens with light theme tokens. Remove all dark-mode-specific animations (glass morphism, dark scrollbar, dark gradient shifts). Keep light-mode scroll animations (fade-in-up, fade-in-left, etc.) but update their colors.

### 10.2 `layout.tsx` — Font and Theme Update

- Remove Inter font import
- Add Oxygen + Inconsolata font imports
- Update body classes from `bg-surface text-text-primary` to `bg-white text-gray-800`

### 10.3 `sidebar.tsx` — Complete Rewrite

- Remove icons (lucide-react imports for nav items)
- Change from fixed to sticky positioning
- Change colors to light theme
- Add collapsible group behavior with arrow rotation
- Remove logout section
- Update active/hover states to blue (`#556cd6`) instead of orange

### 10.4 `topbar.tsx` — Remove or Conditional Render

- Remove from internal pages (dashboard, docs, settings, etc.)
- Keep only on the marketing landing page if needed
- The Webflow clone has no topbar on documentation pages

### 10.5 `page.tsx` (home) — Marketing Page Rewrite

- Update all marketing sections to light theme
- Change hero from dark to white background
- Update CTA button colors to Stripe blue
- Update card styles to light theme with light gray borders

### 10.6 `dashboard/page.tsx` — Dashboard Rewrite

- Update KPI cards to light theme
- Update chart colors to Stripe blue
- Update table styling to light theme
- Update status badge colors

### 10.7 `dashboard-chart.tsx` — Chart Rewrite

- Change card background to white
- Change grid lines to light gray
- Change axis text to muted gray
- Change area stroke to Stripe blue
- Change tooltip to white background

### 10.8 All Settings/Docs/Admin Pages

- Update all card backgrounds to white
- Update all borders to light gray (`#e2e2e2`)
- Update all text to `#333333` primary, `#999` secondary, `#AAADB0` muted
- Update all active states to blue (`#556cd6`)
- Remove all dark glass morphism effects

---

## 11. Animation Implementation Detail

### 11.1 Scroll-Reveal Animation (Sidebar Items)

```css
/* Initial hidden state */
.sidebar-nav-item {
  opacity: 0;
  transform: translate3d(0, -15px, 0);
  transition: opacity 0.3s ease-out, transform 0.3s ease-out;
}

/* Revealed state (added by IntersectionObserver) */
.sidebar-nav-item.revealed {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
```

### 11.2 Sticky Section Title Animation

The section title sticky elements should have a subtle fade-in when they become sticky:

```css
.section-title-sticky {
  position: sticky;
  top: 35px;
  background-color: #ffffff;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.section-title-sticky.sticky-active {
  opacity: 1;
  transform: translateY(0);
}
```

### 11.3 Sticky Heading Animation

```css
.sticky-heading {
  position: sticky;
  top: 70px;
  background-color: #ffffff;
}
```

### 11.4 Code Block Fade-In

Code example blocks should fade in when they enter the viewport:

```css
.example-sticky-wrap {
  position: sticky;
  top: 60px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.example-sticky-wrap.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

### 11.5 Language Tab Transition

When switching language tabs, the code content should cross-fade:

```css
.w-tab-pane {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.w-tab-pane.w--tab-active {
  opacity: 1;
}
```

### 11.6 Arrow Rotation (Collapsible Sidebar)

The nav arrow icons rotate 90 degrees when their section is expanded:

```css
.nav-arrow {
  transition: transform 0.2s ease;
  width: 15px;
  height: 15px;
  opacity: 0.3;
}

.nav-arrow.expanded {
  transform: rotate(90deg);
  opacity: 1;
}
```

### 11.7 Mobile Menu Toggle Animation

The hamburger menu icon animates to an X when open:

```css
.menu-toggler {
  display: none; /* hidden on desktop */
  cursor: pointer;
  padding-right: 7px;
}

@media (max-width: 767px) {
  .menu-toggler {
    display: flex;
  }
}
```

### 11.8 Webflow-Style Scroll Behavior

The Webflow site uses `scroll-behavior: smooth` on the html element:

```css
html {
  scroll-behavior: smooth;
}
```

This is already in the app's `globals.css` — keep it.

---

## 12. Responsive Breakpoints

The Webflow clone uses three breakpoints:

| Breakpoint | Max Width | Changes |
|---|---|---|
| Desktop | > 991px | Full sidebar + two-column method layout |
| Tablet | ≤ 991px | Sidebar min-width 200px, method-area stacks vertically, method-copy padding-right: 0 |
| Mobile | ≤ 767px | Sidebar becomes fixed overlay, sections-wrap gets padding-top: 100px, method-area stacks, nav-arrow expands to 20px |
| Small Mobile | ≤ 479px | Sidebar fixed with z-index: 10, width: 100%, section-title-sticky background: #fff, sidebar-nav-item hidden by default (JS-controlled) |

---

## 13. File Change Manifest

### Files to Modify

| File | Change |
|---|---|
| `apps/merchant-dashboard/src/app/globals.css` | Complete theme rewrite (dark → light) |
| `apps/merchant-dashboard/src/app/layout.tsx` | Font swap (Inter → Oxygen/Inconsolata), body class update |
| `apps/merchant-dashboard/src/components/sidebar.tsx` | Complete rewrite (dark fixed → light sticky, no icons, collapsible) |
| `apps/merchant-dashboard/src/components/topbar.tsx` | Remove from internal pages, keep for marketing |
| `apps/merchant-dashboard/src/app/page.tsx` | Marketing page theme update |
| `apps/merchant-dashboard/src/components/marketing/hero.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/components/marketing/features.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/components/marketing/pricing-comparison.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/components/marketing/self-host.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/components/marketing/open-source.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/components/marketing/footer.tsx` | Dark → light theme |
| `apps/merchant-dashboard/src/app/(dashboard)/dashboard/page.tsx` | Dashboard theme update |
| `apps/merchant-dashboard/src/components/dashboard-chart.tsx` | Chart theme update |
| `apps/merchant-dashboard/src/components/docs-sidebar.tsx` | Update to match Webflow sidebar pattern |
| `apps/merchant-dashboard/src/components/docs-toc.tsx` | Update to match Webflow TOC pattern |

### Files to Create

| File | Purpose |
|---|---|
| `apps/merchant-dashboard/src/components/code-block.tsx` | Prism.js code block with language tabs |
| `apps/merchant-dashboard/src/hooks/use-scroll-reveal.ts` | IntersectionObserver-based scroll reveal hook |
| `apps/merchant-dashboard/src/components/method-layout.tsx` | Two-column method layout (copy + code) |
| `apps/merchant-dashboard/src/components/section-title-sticky.tsx` | Sticky section title component |
| `apps/merchant-dashboard/src/components/lang-switcher.tsx` | Language tab switcher component |
| `apps/merchant-dashboard/src/components/rating-widget.tsx` | "Was this section helpful?" widget |
| `apps/merchant-dashboard/public/brand/logo.svg` | Project's custom AVALogo SVG (user-provided, replaces logo.svg and logo-dark.svg) |

### Files to Remove

| File | Reason |
|---|---|
| `apps/merchant-dashboard/src/components/mode-badge.tsx` | No longer needed (sandbox toggle moves to topbar) |
| `apps/merchant-dashboard/src/components/mode-config-banner.tsx` | No longer needed |
| `apps/merchant-dashboard/public/brand/logo-dark.svg` | Replaced by user's custom AVALogo SVG |

---

## 14. Implementation Tasks

### Foundation
- [ ] Update `globals.css` with light theme tokens
- [ ] Update `layout.tsx` with new fonts (Oxygen + Inconsolata) and body classes
- [ ] Update `tailwind.config.ts` with new font families and colors
- [ ] Install Prism.js dependencies (`prismjs`, `prism-themes`)
- [ ] Replace logo SVG in `public/brand/` with the project's custom SVG logo
- [ ] Update `sidebar.tsx` to light sticky theme (no icons, collapsible groups, blue active state)
- [ ] Remove `topbar.tsx` from internal page layouts

### Marketing Pages
- [ ] Update `hero.tsx` to light theme (white bg, blue accents, no gradient orbs)
- [ ] Update `features.tsx` to light theme (white cards, light gray borders)
- [ ] Update `pricing-comparison.tsx` to light theme
- [ ] Update `self-host.tsx` to light theme
- [ ] Update `open-source.tsx` to light theme
- [ ] Update `footer.tsx` to light theme
- [ ] Update `page.tsx` (home) layout

### Dashboard
- [ ] Update `dashboard/page.tsx` KPI cards and table to light theme
- [ ] Update `dashboard-chart.tsx` colors (Stripe blue stroke, light gray grid)
- [ ] Update all settings pages to light theme
- [ ] Update all docs pages to light theme
- [ ] Update all admin pages to light theme

### Code Blocks & Animations
- [ ] Create `code-block.tsx` component with Prism.js and language tabs
- [ ] Create `lang-switcher.tsx` tab component
- [ ] Create `use-scroll-reveal.ts` hook (IntersectionObserver)
- [ ] Create `method-layout.tsx` two-column layout (copy + code)
- [ ] Create `section-title-sticky.tsx` component
- [ ] Create `rating-widget.tsx` component
- [ ] Add sticky behavior to all method sections (sidebar, section titles, headings, code examples)
- [ ] Add scroll-triggered reveal animations to sidebar items
- [ ] Add language tab switching to all code examples
- [ ] Add line numbers to all code blocks
- [ ] Add copy-to-clipboard buttons

### Polish & Testing
- [ ] Responsive breakpoint testing (991px, 767px, 479px)
- [ ] Mobile sidebar toggle implementation (fixed overlay with hamburger)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Print stylesheet (if needed)
- [ ] Final pixel-perfect comparison against Webflow clone screenshots

---

## 15. Pixel-Perfect Detail Reference

### 15.1 Webflow CSS Specific Values to Match

| Property | Value | Source |
|---|---|---|
| `.page-wrap` max-width | `940px` | Webflow CSS line 821 |
| `.sidebar-wrap` width | `200px` (desktop), `100%` (mobile) | Webflow CSS |
| `.method-area` padding | `5vw` | Webflow CSS line 2331 |
| `.method-copy` padding-right | `60px` | Webflow CSS line 2336 |
| `.method-examples` width | `500px` | Webflow CSS line 2345 |
| `.method-examples` margin-top | `60px` | Webflow CSS line 2346 |
| `.example-sticky-wrap` top | `60px` | Webflow CSS line 2467 |
| `.sticky-heading` top | `70px` | Webflow CSS line 2893 |
| `.section-title-sticky` top | `35px` (desktop), `80px` (mobile) | Webflow CSS lines 2876-2887 |
| `.sidebar-nav-item` padding | `4px 12px` | Webflow CSS line 2521 |
| `.sidebar-nav-item` hover color | `#141f41` | Webflow CSS line 2529 |
| `.sidebar-nav-item.w--current` bg | `rgba(85, 108, 214, 0.05)` | Webflow CSS line 2533 |
| `.sidebar-nav-item.w--current` color | `#556cd6` | Webflow CSS line 2534 |
| `.method-type` color (POST/GET) | `#40d63b` | Webflow CSS line 2596 |
| `.method-type.light` color | `#4f566b` | Webflow CSS line 2601 |
| `.method-request` color | `#a3acb9` | Webflow CSS line 2607 |
| `.lang-switcher-tab-link` color | `#e3e8ee` | Webflow CSS line 2646 |
| `.lang-switcher-tab-link:hover` bg | `#39415e` | Webflow CSS line 2650 |
| `.lang-switcher-tab-link:hover` color | `#fff` | Webflow CSS line 2651 |
| `.example-codeblock` padding | `10px 20px` | Webflow CSS line 2677 |
| `.example-code.light` bg | `#e3e8ee` | Webflow CSS line 2461 |
| `.brand` width | `60px` | Webflow CSS line 2697 |
| `.brand` padding | `right: 10px; left: 15px` | Webflow CSS lines 2698-2699 |
| `.menu-toggler` padding-right | `7px` | Webflow CSS line 2727 |
| `.nav-arrow` width/height | `15px` | Webflow CSS lines 2580-2581 |
| `.nav-arrow` opacity | `0.3` | Webflow CSS line 2582 |
| `.rating-widget` margin-top | `32px` | Webflow CSS line 2548 |
| `.rating-link` color | `#a3acb9` | Webflow CSS line 2576 |
| `.method-area-divider` border | `1px solid #e3e8ee` | Webflow CSS line 2351 |
| `.intro-leadpara` margin-bottom | `16px` | Webflow CSS line 2369 |
| `.intro-leadpara` line-height | `1.5` | Webflow CSS line 2369 |
| `body` font-family | `Arial, sans-serif` | Webflow CSS line 287 |
| `body` color | `#333` | Webflow CSS line 290 |
| `body` background | `#fff` | Webflow CSS line 286 |
| `h1` font-size | `2em` | Webflow CSS line 76 |
| `h1` margin | `0.67em 0` | Webflow CSS line 77 |
| `code` font-family | `monospace, monospace` | Webflow CSS line 130 |
| `pre` font-family | `Inconsolata, monospace` | Webflow CSS line 2381 |
| `h5` font-family | `Oxygen, sans-serif` | Webflow CSS line 2265 |
| `.sidebar-nav-heading-text` margin | `0` | Webflow CSS line 2499 |
| `.sidebar-nav-items` padding-right | `8px` | Webflow CSS line 2510 |
| `.sidebar-nav-items.sl-nav` padding-left | `20px` | Webflow CSS line 2516 |
| `.sidebar-nav-item.sl-nav-item` font-weight | `400` | Webflow CSS line 2538 |
| `.w-webflow-badge` display | `block` | Webflow CSS line 413 |
| `.w-webflow-badge>img` max-width | `inherit` | Webflow CSS line 440 |

### 15.2 Webflow Interaction Data Attributes

The Webflow site uses `data-w-id` attributes for scroll-triggered animations. Each element that animates in has a unique UUID. The Webflow JS engine reads these to apply `opacity` and `transform` animations when elements enter the viewport.

For the app, replace Webflow JS with a custom React hook using `IntersectionObserver` (see Code Blocks & Animations tasks).

### 15.3 Webflow Tabs Component

The Webflow `w-tabs` component uses:
- `w-tab-menu` for the tab list container
- `w-tab-link` for each tab button
- `w--current` class on the active tab
- `w-tab-content` for the content container
- `w-tab-pane` for each tab panel
- `w--tab-active` class on the active panel

---

## 16. Summary of All Changes

1. **Color scheme**: Dark → Light (white background, gray text, blue accents)
2. **Typography**: Inter → Oxygen (headings) + Arial (body) + Inconsolata (code)
3. **Layout**: Fixed sidebar → Sticky sidebar, no topbar on internal pages
4. **Sidebar**: Icon+text → Text-only, collapsible groups, blue active state
5. **Code blocks**: None → Prism.js with language tabs, line numbers, copy buttons
6. **Sticky behavior**: None → Sticky headings, section titles, and code examples
7. **Scroll animations**: None → IntersectionObserver-driven fade-in reveals
8. **Logo**: OpenPay → custom AVALogo SVG
9. **Buttons**: Rounded + orange → Square (0 border-radius) + Stripe blue
10. **Cards**: Dark glass → White with light gray border and subtle shadow
11. **Tables**: Dark → White with light gray borders and hover states
12. **Badges**: Colored pill badges → Stripe-colored badges with light backgrounds
13. **Responsive**: Add 3 breakpoints (991px, 767px, 479px) matching Webflow
14. **Mobile**: Sidebar becomes fixed overlay with hamburger menu toggle
15. **Remove**: Topbar from internal pages, Webflow watermark badge, mode toggle from sidebar