# The Unseen CEOs — Technical Documentation

**Version:** 1.0
**Stack:** React 19 · Vite 7.3 · Tailwind CSS v4 · Gemini 2.5 Flash Lite
**Type:** Client-only Single Page Application (SPA)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Routing](#5-routing)
6. [Global State (DataContext)](#6-global-state-datacontext)
7. [Data Model](#7-data-model)
8. [Utilities](#8-utilities)
9. [AI Integration (Gemini)](#9-ai-integration-gemini)
10. [Pages & Features](#10-pages--features)
11. [Component Reference](#11-component-reference)
12. [Styling System](#12-styling-system)
13. [localStorage Persistence](#13-localstorage-persistence)
14. [Environment Setup](#14-environment-setup)
15. [Scripts](#15-scripts)

---

## 1. Project Overview

**The Unseen CEOs** is a digital platform that identifies, evaluates, and presents investment-ready profiles of women who genuinely run their businesses in India's informal economy — distinguishing real decision-makers from name-only registrations.

### Core Problem
Millions of Indian microbusinesses are registered in women's names, but household power structures mean men often retain real control. Only 9% of women entrepreneurs have meaningful financial decision-making power (IFMR/SEWA, 2022). This creates a credibility gap for lenders and investors trying to fund genuine women-led ventures.

### Platform Solution
| Module | What It Does |
|--------|-------------|
| Data Collection Dashboard | NGO/student researchers upload structured interview data from 40–50 women entrepreneurs |
| Agency Score Engine | 5-parameter scorecard quantifies genuine leadership (pricing, supplier negotiation, profit control, operations, digital skills) |
| Entrepreneur Profiles | Clean, investor-ready one-page summaries with business metrics |
| Business Plan Builder | Template forms + Gemini AI chatbot generate revenue models, unit economics, and working capital estimates |
| Investor Matching | Filtered view of shortlisted ventures aligned with funder criteria |

---

## 2. Tech Stack

### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.2 | UI framework with concurrent features |
| `react-dom` | 19.2 | DOM renderer |
| `react-router-dom` | 7.13 | Client-side routing, nested layouts |
| `recharts` | 3.7 | Radar, Bar, and Pie chart components |
| `lucide-react` | 0.574 | SVG icon library (tree-shakeable) |
| `papaparse` | 5.5 | Client-side CSV parsing |
| `@google/generative-ai` | 0.24 | Official Gemini SDK |

### Dev Dependencies
| Package | Purpose |
|---------|---------|
| `vite` 7.3 | Build tool and dev server with HMR |
| `@vitejs/plugin-react` | Babel-based React transforms |
| `@tailwindcss/vite` | Tailwind CSS v4 Vite integration |
| `tailwindcss` 4.1 | CSS utility framework |
| `babel-plugin-react-compiler` | React 19 compiler optimisation |
| `eslint` + plugins | Linting (hooks, refresh) |

---

## 3. Project Structure

```
unseenceo/
├── index.html                        # App entry HTML
├── vite.config.js                    # Vite + React + Tailwind plugins
├── .env                              # VITE_GEMINI_API_KEY (not committed)
├── .gitignore
├── package.json
│
└── src/
    ├── main.jsx                      # ReactDOM.createRoot → <App />
    ├── App.jsx                       # Router + DataProvider + all routes
    ├── index.css                     # Tailwind import + @theme color tokens
    │
    ├── data/
    │   └── mockData.js               # 12 demo entrepreneurs, AGENCY_PARAMETERS, SECTORS
    │
    ├── utils/
    │   ├── agencyScore.js            # Score calculation, formatting, CSV parsing
    │   └── gemini.js                 # Gemini API wrapper, prompt templates
    │
    ├── context/
    │   └── DataContext.jsx           # Global state: useReducer + localStorage sync
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx            # Reusable button (4 variants, 3 sizes)
    │   │   ├── Card.jsx              # Reusable card wrapper with icon/title
    │   │   └── MarkdownRenderer.jsx  # Zero-dep markdown → React JSX parser
    │   │
    │   ├── layout/
    │   │   ├── Navbar.jsx            # Fixed top bar, logo, search, hamburger
    │   │   ├── Sidebar.jsx           # Nav links, mobile overlay, bottom card
    │   │   └── Layout.jsx            # Navbar + Sidebar + <Outlet /> shell
    │   │
    │   ├── dashboard/
    │   │   ├── StatsCards.jsx        # 4 summary metric cards
    │   │   ├── EntrepreneurTable.jsx # Sortable/filterable data table
    │   │   └── DataUpload.jsx        # Drag-drop CSV/JSON ingestion
    │   │
    │   ├── agency/
    │   │   ├── RadarChart.jsx        # Recharts radar (1 or 2 entrepreneurs)
    │   │   ├── ScoreBreakdown.jsx    # 5-parameter horizontal bar breakdown
    │   │   └── ScoreCard.jsx         # Compact agency score card for grids
    │   │
    │   ├── profile/
    │   │   ├── ProfileCard.jsx       # Gradient header + avatar + meta
    │   │   ├── BusinessMetrics.jsx   # Financial overview + bar chart + unit economics
    │   │   └── FundingPlan.jsx       # Funding ask + growth timeline + interview notes
    │   │
    │   ├── builder/
    │   │   ├── TemplateForm.jsx      # 3-tab form with AI generation buttons
    │   │   └── AIChatbot.jsx         # Floating chat widget (Gemini-powered)
    │   │
    │   └── matching/
    │       ├── FilterPanel.jsx       # Sector / score / funding / shortlist filters
    │       └── MatchCard.jsx         # Entrepreneur card with mini-radar
    │
    └── pages/
        ├── Landing.jsx               # Public marketing page (no sidebar)
        ├── Dashboard.jsx             # Data hub: upload + table + stats
        ├── AgencyScore.jsx           # Overview / detail / comparison views
        ├── Profiles.jsx              # Grid of all entrepreneur profile cards
        ├── EntrepreneurProfile.jsx   # Full single-entrepreneur detail page
        ├── BusinessPlanBuilder.jsx   # Plan builder + AI chatbot
        ├── Matching.jsx              # Filtered investor-facing view
        └── About.jsx                 # Mission, methodology, team, toolkit
```

---

## 4. Architecture & Data Flow

### State Management
The app uses **React Context + useReducer** — no external state library. All global state lives in `DataContext`. Components read state via the `useData()` hook and trigger changes via `dispatch(action)`.

```
DataProvider (wraps entire app)
  │
  ├── entrepreneurs[]        ← seeded from localStorage or mockData
  ├── filters{}              ← sector, minScore, maxFunding, shortlistedOnly, searchQuery
  ├── comparisonIds[]        ← max 2 IDs, used on AgencyScore comparison view
  ├── sidebarOpen            ← drives mobile sidebar toggle
  │
  ├── filteredEntrepreneurs  ← computed on every filter change
  └── summaryStats{}         ← computed counts and averages for StatsCards
```

### Data Flow Diagram

```
Upload (CSV/JSON)
  → parseCSVToEntrepreneurs()
  → dispatch ADD_UPLOADED_DATA
  → entrepreneurs[] updated
  → localStorage synced
  → UI re-renders via context

Filter change (sector/score/funding)
  → dispatch UPDATE_FILTERS
  → filteredEntrepreneurs recomputed
  → EntrepreneurTable / Matching page re-renders

Click entrepreneur row
  → navigate('/profiles/:id')
  → useParams() → getEntrepreneurById(id)
  → EntrepreneurProfile renders full detail

Business Plan Builder
  → select entrepreneur (dropdown)
  → useEffect syncs form fields on id change
  → user edits fields → live calculations update
  → "Generate with AI" → generateBusinessPlanSection()
  → Gemini API call → MarkdownRenderer displays result

AI Chatbot
  → user types message
  → sendMessage(text, history, entrepreneurContext)
  → Gemini API call (max 400 tokens, temp 0.5)
  → MarkdownRenderer renders response bubble
```

---

## 5. Routing

Defined in `src/App.jsx`. Two route trees:

```
/                              → Landing.jsx          (no Layout wrapper)

<Layout>                       (Navbar + Sidebar + Outlet)
  /dashboard                   → Dashboard.jsx
  /agency                      → AgencyScore.jsx
  /profiles                    → Profiles.jsx
  /profiles/:id                → EntrepreneurProfile.jsx
  /builder                     → BusinessPlanBuilder.jsx
  /matching                    → Matching.jsx
  /about                       → About.jsx
</Layout>
```

**Landing** sits outside `<Layout>` intentionally — it is a full-width immersive marketing page without a sidebar or navbar.

All other pages share the `<Layout>` wrapper which renders via React Router's `<Outlet />`.

---

## 6. Global State (DataContext)

**File:** `src/context/DataContext.jsx`

### State Shape

```js
{
  entrepreneurs: Entrepreneur[],   // Full dataset (mock + uploaded)
  filters: {
    sector: 'all' | string,
    minAgencyScore: 0–100,
    maxFundingNeeded: number | Infinity,
    shortlistedOnly: boolean,
    searchQuery: string,
  },
  selectedEntrepreneurId: string | null,
  comparisonIds: string[],         // Max 2 for radar comparison
  sidebarOpen: boolean,
}
```

### Computed Values (exposed by provider)

```js
filteredEntrepreneurs   // entrepreneurs filtered by all active filters
summaryStats: {
  total, avgAgencyScore, totalFunding, shortlisted,
  highAgency, moderateAgency, lowAgency
}
getEntrepreneurById(id) // helper function
```

### Reducer Actions

| Action Type | Payload | Effect |
|-------------|---------|--------|
| `SET_ENTREPRENEURS` | `Entrepreneur[]` | Replace full dataset |
| `ADD_UPLOADED_DATA` | `Entrepreneur[]` | Append uploaded entries |
| `UPDATE_FILTERS` | `Partial<filters>` | Merge into current filters |
| `RESET_FILTERS` | — | Clear all filters to defaults |
| `SELECT_ENTREPRENEUR` | `id: string` | Set selectedEntrepreneurId |
| `TOGGLE_COMPARISON` | `id: string` | Add/remove from comparisonIds (max 2) |
| `TOGGLE_SHORTLIST` | `id: string` | Flip isShortlisted for one entrepreneur |
| `UPDATE_ENTREPRENEUR` | `{id, updates}` | Patch one entrepreneur's fields |
| `TOGGLE_SIDEBAR` | — | Flip sidebarOpen |
| `CLOSE_SIDEBAR` | — | Set sidebarOpen = false |
| `RESET_DATA` | — | Revert to mockEntrepreneurs |

### Persistence
On every `entrepreneurs` state change, `useEffect` serialises the array to `localStorage` under key `'unseenceo_data'`. On mount, DataContext reads from localStorage first; falls back to mockData if the key is absent or parse fails.

---

## 7. Data Model

### Entrepreneur Object

```js
{
  // Identity
  id: string,                      // 'uc-001' … 'uc-012', or 'uc-upload-{uuid}'
  name: string,
  age: number,
  location: string,                // "City, State"
  state: string,
  sector: string,                  // One of 8 sectors (see below)
  businessName: string,
  businessType: string,
  yearsInBusiness: number,
  registrationType: 'Udyam' | 'MSME' | 'Informal',

  // Agency Score (5 parameters, each 1–5)
  agencyScore: {
    pricingControl: 1–5,
    supplierNegotiation: 1–5,
    profitControl: 1–5,
    operationsManagement: 1–5,
    digitalSkills: 1–5,
    total: 5–25,                   // Sum of 5 params
    percentage: 20–100,            // (total / 25) × 100
  },

  // Financials (all in ₹)
  monthlyRevenue: number,
  monthlyCosts: number,
  monthlyProfit: number,
  fundingNeeded: number,
  fundingPurpose: string,
  currentFundingSources: string[],

  // Unit Economics
  unitEconomics: {
    productName: string,
    unitPrice: number,
    unitCost: number,
    dailyUnits: number,
    marginPerUnit: number,
  },

  // Growth Plan
  growthPlan: {
    shortTerm: string,             // 3-month target
    mediumTerm: string,            // 12-month target
    longTerm: string,              // 2-year vision
  },

  // Interview Metadata
  interviewNotes: string,
  challenges: string[],
  interviewDate: string,           // 'YYYY-MM-DD'
  interviewedBy: string,
  isShortlisted: boolean,
  avatarColor: string,             // Hex colour for avatar background
}
```

### 12 Demo Entrepreneurs

| ID | Name | Sector | Agency % | Funding Needed | Shortlisted |
|----|------|--------|----------|----------------|-------------|
| uc-001 | Lakshmi Devi | Food & Catering | 72% | ₹1,00,000 | Yes |
| uc-002 | Fatima Bano | Tailoring & Garments | 88% | ₹1,50,000 | Yes |
| uc-003 | Sunita Kumari | Beauty & Wellness | 84% | ₹80,000 | Yes |
| uc-004 | Meena Patel | Grocery & Kirana | 44% | ₹2,00,000 | No |
| uc-005 | Kavitha Murugan | Handicrafts & Artisanal | 88% | ₹75,000 | Yes |
| uc-006 | Radha Yadav | Food & Catering | 60% | ₹50,000 | No |
| uc-007 | Anita Behera | Tailoring & Garments | 80% | ₹1,20,000 | Yes |
| uc-008 | Pooja Sharma | Handicrafts & Artisanal | 80% | ₹1,00,000 | Yes |
| uc-009 | Geeta Devi | Grocery & Kirana | 32% | ₹1,50,000 | No |
| uc-010 | Priyanka Gowda | Dairy & Agri Processing | 88% | ₹2,00,000 | Yes |
| uc-011 | Nirmala Joshi | Tutoring & Education | 96% | ₹60,000 | Yes |
| uc-012 | Rekha Vishwakarma | Mobile Repair & Electronics | 68% | ₹90,000 | No |

### Agency Score Tiers

| Tier | Percentage | Tailwind Color |
|------|-----------|---------------|
| High Agency | 76–100% | Green |
| Moderate Agency | 48–75% | Amber |
| Low Agency | < 48% | Red |

### 5 Agency Parameters

| Key | Label | What It Measures |
|-----|-------|-----------------|
| `pricingControl` | Pricing Control | Does she set her own prices independently? |
| `supplierNegotiation` | Supplier Negotiation | Does she choose and negotiate with suppliers? |
| `profitControl` | Profit Control | Does she decide how profits are spent or reinvested? |
| `operationsManagement` | Operations | Does she manage daily business operations? |
| `digitalSkills` | Digital Skills | Does she use UPI, digital bookkeeping, mobile banking? |

---

## 8. Utilities

### `src/utils/agencyScore.js`

| Function | Signature | Purpose |
|----------|-----------|---------|
| `calculateAgencyScore(params)` | `(object) → {total, percentage, tier}` | Sums 5 params, computes percentage and tier label |
| `getScoreTier(percentage)` | `(number) → string` | Returns `'High Agency'`, `'Moderate Agency'`, or `'Low Agency'` |
| `getScoreTierColor(percentage)` | `(number) → {bg, text, border}` | Returns Tailwind class strings for colour-coding |
| `getBarColor(score)` | `(1–5) → string` | Returns green / amber / red Tailwind bg class for parameter bars |
| `formatINR(amount)` | `(number) → string` | Formats as `₹X,XX,XXX` using `en-IN` locale |
| `parseCSVToEntrepreneurs(csv)` | `(string) → {valid[], errors[]}` | PapaParse → validates → maps columns → auto-calculates derived fields |
| `generateTemplateCSV()` | `() → string` | Returns CSV header row for all 31 fields (used for template download) |

### `src/utils/gemini.js`

| Function | Signature | Purpose |
|----------|-----------|---------|
| `isApiKeyConfigured()` | `() → boolean` | Checks `VITE_GEMINI_API_KEY` is set and not a placeholder |
| `sendMessage(msg, history, ctx)` | `(string, array, object?) → {success, data?, error?}` | Multi-turn Gemini chat with entrepreneur context injection |
| `generateBusinessPlanSection(e, type)` | `(Entrepreneur, string) → {success, data?, error?}` | Pre-built prompts for `revenue_model`, `unit_economics`, `working_capital`, `growth_plan` |

---

## 9. AI Integration (Gemini)

**Model:** `gemini-2.5-flash-lite`
**SDK:** `@google/generative-ai`
**Config:** `maxOutputTokens: 400`, `temperature: 0.5`

### System Prompt (enforced on every call)
- Maximum 150 words per response
- 3–5 bullet points only, no long paragraphs
- Lead with the single most important number or insight
- All monetary amounts in ₹ (INR)
- Skip greetings, closings, and filler phrases
- Informal economy context: SHGs, MUDRA loans, Udyam registration

### Conversation Management
Each call to `sendMessage` rebuilds the full chat history from scratch using `model.startChat({ history: [...] })`. This means conversation context is maintained within the chatbot session but not persisted across page refreshes (intentional — conversations are ephemeral).

### Entrepreneur Context Injection
When a user selects an entrepreneur in the Business Plan Builder, their data (name, sector, revenue, profit, agency score, challenges) is appended to the system prompt so AI responses are specific to that entrepreneur.

### Error Handling
| Error Type | Message |
|-----------|---------|
| API key missing/placeholder | "API key not configured" fallback UI |
| Invalid API key | "Invalid API key" error bubble in chat |
| Rate limit exceeded | "Rate limit reached, try again" message |
| Network/other | Generic retry message |

### Pre-built Section Prompts
Each prompt specifies exact bullet count and word limit:
| Section | Prompt Asks For |
|---------|----------------|
| `revenue_model` | Current monthly revenue, top revenue driver, pricing improvement, volume lever (3–5 bullets, max 120 words) |
| `unit_economics` | Gross margin %, contribution margin, break-even units, one cost-reduction tip (4 bullets, max 100 words) |
| `working_capital` | Recommended amount, why ₹1L is optimal, cycle days, best funding source (4 bullets, max 120 words) |
| `growth_plan` | 3-month target, 12-month target, 2-year vision (exactly 3 bullets, max 100 words) |

### MarkdownRenderer
`src/components/common/MarkdownRenderer.jsx` — a zero-dependency React component that converts Gemini's markdown output to styled JSX:

| Markdown | Rendered As |
|----------|------------|
| `# Heading` | `<h3>` bold, `text-warm-900` |
| `## Heading` | `<h4>` semibold |
| `### Heading` | `<h5>` |
| `**bold**` | `<strong>` |
| `*italic*` | `<em>` |
| `` `code` `` | `<code>` with `bg-warm-200` chip |
| `- item` / `* item` | `<ul>` disc list |
| `1. item` | `<ol>` numbered list |
| `---` | `<hr>` divider |
| blank line | spacing `<div>` |

Used in both `AIChatbot` (message bubbles) and `TemplateForm` (AI output block).

---

## 10. Pages & Features

### Landing — `/`
Full-width marketing page (no sidebar). Sections:
- **Hero** — gradient background, headline, 9% statistic callout, two CTAs
- **Problem Statement** — 3 cards: Economic Inequality, Market Inefficiency, Gender Gaps
- **How It Works** — 4-step visual flow: Data → Score → Plan → Match
- **Key Stats strip** — 12+ entrepreneurs, 5 parameters, ~₹1L optimal
- **CTA section** — "Enter Dashboard" link
- **Footer** — minimal branding

### Dashboard — `/dashboard`
Operational hub for NGO field researchers.
- **StatsCards** — total entrepreneurs, average agency score, total funding needed, shortlisted count
- **EntrepreneurTable** — sortable by name / sector / score / revenue / funding; click row → `/profiles/:id`; star icon toggles shortlist; sector dropdown + tier filter + search bar
- **DataUpload** — drag-and-drop or click-to-browse; accepts `.csv` and `.json`; validates structure; shows preview of parsed records; "Download Template CSV" for onboarding new researchers; "Reset to Demo Data" clears localStorage

### Agency Score — `/agency`
Three view modes driven by URL search params and context state:

**Overview** (default)
- Grid of `ScoreCard` components for all entrepreneurs
- Sort: Highest / Lowest / Alphabetical
- Sector filter dropdown
- "Compare" toggle on each card — select 2 to enter comparison mode

**Detail view** (`?id=uc-001`)
- Full `RadarChart` for one entrepreneur
- `ScoreBreakdown` with all 5 parameter bars
- Methodology explanation with tier definitions

**Comparison view** (2 items in `comparisonIds`)
- Overlaid `RadarChart` with two coloured series
- Side-by-side `ScoreBreakdown` columns
- "Clear Comparison" resets both selections

### Profiles — `/profiles`
Card grid of all entrepreneurs from `filteredEntrepreneurs`. Each card shows avatar, name, business name, sector, location, monthly revenue, and agency tier badge. Click navigates to `/profiles/:id`.

### Entrepreneur Profile — `/profiles/:id`
Full investor-ready one-page summary:
- **ProfileCard** — gradient orange header; avatar absolutely positioned at the border (bottom-8); name, business, location, sector, years in business, registration type fully in the white section
- **BusinessMetrics** — 4 financial metric cards (revenue / costs / profit / margin); Recharts `BarChart` visualising revenue vs costs vs profit; unit economics breakdown
- **ScoreBreakdown** — reused from agency module, shows 5-parameter score
- **FundingPlan** — funding amount + purpose; current funding sources (badge list); growth plan timeline (short / medium / long-term with visual connector); interview notes and challenges

### Business Plan Builder — `/builder`

**TemplateForm** — 3-tab calculator:

| Tab | Inputs | Calculated Outputs |
|-----|--------|-------------------|
| Revenue Model | Unit price, daily units, operating days | Monthly revenue, annual revenue |
| Unit Economics | Material cost, labour, overhead, selling price, daily units | Gross margin %, contribution margin, break-even units; Recharts `PieChart` of cost breakdown |
| Working Capital | Raw material, rent, utilities, labour (monthly) | Working capital needed, why ₹1L optimal (static explanation) |

Each tab has a "Generate with AI" button that calls `generateBusinessPlanSection()` and renders the result via `MarkdownRenderer`.

**AIChatbot** — floating bottom-right widget:
- Minimise/maximise button
- 4 quick-prompt buttons on first open
- Multi-turn conversation with full history maintained per session
- Entrepreneur context injected when one is selected in TemplateForm
- `MarkdownRenderer` for AI response bubbles
- Graceful API key missing state (no crash, clear instruction)

### Matching — `/matching`
Investor-facing view:
- **FilterPanel** (left sidebar) — sector multi-select checkboxes; minimum agency score dropdown (0%, 50%, 60%, 70%, 80%); maximum funding dropdown (Any / ₹50k / ₹1L / ₹2L); shortlisted-only toggle; active filters shown as removable chips; Reset button
- **Search bar** — name/business name search
- **Sort dropdown** — Highest Score / Lowest Funding / Highest Profit / Alphabetical
- **MatchCard grid** — 1→2→3 column responsive; each card shows tier accent bar, avatar, agency score badge, metrics row, mini radar chart, funding purpose, View Profile and shortlist toggle actions
- Empty state when filters return no results

### About — `/about`
Static information page:
- Mission statement
- Agency Score methodology table (5 parameters with scoring criteria 1–5)
- Tier definitions (High / Moderate / Low with percentage thresholds)
- Team member cards
- 7-step replication toolkit for other student teams / NGOs
- Data sources and references (IFMR/SEWA 2022)

---

## 11. Component Reference

### Common

**`Button`** props: `variant` (`primary` | `secondary` | `outline` | `ghost` | `danger`), `size` (`sm` | `md` | `lg`), `icon` (Lucide component), `disabled`, `onClick`, `className`, `children`

**`Card`** props: `title`, `subtitle`, `icon` (Lucide component), `padding` (`sm` | `md` | `lg`), `hoverable` (boolean), `className`, `children`

**`MarkdownRenderer`** props: `children` (string — raw markdown), `className`

### Layout

**`Navbar`** — reads `sidebarOpen` from context; dispatches `TOGGLE_SIDEBAR` on hamburger; search input dispatches `UPDATE_FILTERS` with `searchQuery`.

**`Sidebar`** — `flex flex-col`, `h-[calc(100vh-4rem)]` on desktop; nav is `flex-1 overflow-y-auto` so long nav never overlaps bottom card; bottom card is `shrink-0` pushed by flex; mobile uses `translate-x` animation + backdrop overlay.

**`Layout`** — renders `<Outlet />` from React Router inside `<main className="flex-1 lg:ml-64">`. The `lg:ml-64` accounts for the 256px wide sidebar on desktop.

### Dashboard

**`EntrepreneurTable`** — maintains local `sortKey`, `sortDir`, and `viewMode` state. On mobile (`< md`), switches automatically to card grid layout instead of table rows for touch usability.

**`DataUpload`** — uses `useRef` for file input, `useState` for drag state and `preview[]`. On success, dispatches `ADD_UPLOADED_DATA` and shows a per-row error report for invalid fields.

### Agency

**`RadarChart`** — wraps Recharts `RadarChart` in `ResponsiveContainer`. When `entrepreneurs[]` has 2 items, renders two `<Radar>` series with different stroke colours (primary-500 and amber-500). Labels are the 5 parameter short names.

**`ScoreBreakdown`** — renders each parameter as a div-based bar (not Recharts) for precise colour control. Bar width = `(score / 5) * 100%`. Colours from `getBarColor()`: green (4–5), amber (3), red (1–2).

### Builder

**`TemplateForm`** — `InputField` component is defined **at module level** (not inside the component function) to prevent React from remounting inputs on every keystroke. State sync from a newly selected entrepreneur uses `useEffect` with `selectedEntrepreneur?.id` as the dep, so fields only reset when the entrepreneur actually changes.

**`AIChatbot`** — conversation history is component state (not context or localStorage). Calls `model.startChat({ history: [...] })` on each send, passing all previous messages as context. `useRef` on the messages container enables auto-scroll to latest message.

---

## 12. Styling System

**Framework:** Tailwind CSS v4 with CSS-first configuration via `@theme` directive in `src/index.css`.

### Custom Colour Tokens

```css
@theme {
  /* Primary — warm terracotta orange */
  --color-primary-50  … --color-primary-900

  /* Accent — amber */
  --color-amber-50  … --color-amber-500

  /* Neutrals — warm stone grays */
  --color-warm-50  … --color-warm-900
}
```

These tokens generate Tailwind classes like `bg-primary-500`, `text-warm-900`, `border-amber-300` — the platform uses these exclusively (no raw hex values in components).

### Responsive Breakpoints
| Breakpoint | Width | Used For |
|-----------|-------|---------|
| `sm` | 640px | Phone landscape, 2-col grids |
| `md` | 768px | Tablet portrait, table → card switch |
| `lg` | 1024px | Sidebar visible, 3-col grids, full table |
| `xl` | 1280px | Wider content areas |

### Key Design Patterns
- **Cards:** `bg-white rounded-xl border border-warm-200 shadow-sm`
- **Page bg:** `bg-warm-50`
- **Sidebar:** `bg-warm-900` (dark warm)
- **Primary action:** `bg-primary-500 hover:bg-primary-600 text-white`
- **Active nav link:** `bg-primary-500/20 text-primary-300`
- **Agency tiers:** green-500 / amber-400 / red-400

### Font
Inter (Google Fonts) loaded via `<link>` in `index.html`. Applied via `--font-family-sans` theme token.

---

## 13. localStorage Persistence

**Key:** `'unseenceo_data'`
**Content:** Serialised `Entrepreneur[]` array
**When saved:** `useEffect` in DataContext fires after every change to `entrepreneurs` state
**When loaded:** DataContext `getInitialState()` on first render — reads localStorage, falls back to `mockEntrepreneurs` if key absent or JSON parse fails
**Reset:** Dashboard "Reset to Demo Data" button calls `localStorage.removeItem('unseenceo_data')` then dispatches `RESET_DATA`

Failure to read/write localStorage (quota exceeded, private browsing restrictions) is caught silently — the app falls back to in-memory state.

---

## 14. Environment Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Installation
```bash
git clone <repo-url>
cd unseenceo
npm install
```

### Environment Variables
Create a `.env` file in the project root:
```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

> The `.env` file is listed in `.gitignore` and is never committed.
> Without a valid key, all AI features degrade gracefully to a "Configure API key" message. All other platform features work without it.

### Get a Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com)
2. Sign in with a Google account
3. Create a new API key
4. Paste it into `.env` as shown above
5. Restart the dev server

---

## 15. Scripts

```bash
npm run dev       # Start Vite dev server at http://localhost:5173 with HMR
npm run build     # Production build → dist/
npm run preview   # Serve production build locally
npm run lint      # Run ESLint on all .jsx files
```

The production build outputs a single HTML file with hashed JS and CSS bundles in `dist/`. The app is a pure client-side SPA — it can be deployed to any static host (Vercel, Netlify, GitHub Pages).

---

*Last updated: February 2026*
