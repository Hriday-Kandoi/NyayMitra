# NyayMitra UI Testing & Fixing Prompt

## Executive Summary
Complete UI/UX audit and proportionality fix for the NyayMitra legal tech application. Focus on visual consistency, typography hierarchy, spacing coherence, and responsive design.

---

## Part 1: AUTOMATED UI TESTING CHECKLIST

### 1.1 Typography System Audit
**Current State:**
- Base font: system-ui, -apple-system, sans-serif
- Issue: No consistent typography scale defined

**Tests to Run:**
- [ ] Verify all headings use proper sizing hierarchy (H1: 2.5rem, H2: 2rem, H3: 1.5rem, H4: 1.25rem)
- [ ] Check body text consistency (16px base, 14px secondary, 12px tertiary)
- [ ] Validate font weights (400 normal, 500 medium, 600 semibold, 700 bold)
- [ ] Ensure labels and helper text use proper size (12-14px)
- [ ] Verify all numbers/counters use monospace for alignment (font-mono)
- [ ] Check line-heights (1.5 for body, 1.2 for headings)

**Expected Output:**
```css
/* Typography Scale */
h1 { font-size: 2.5rem; font-weight: 700; line-height: 1.2; }
h2 { font-size: 2rem; font-weight: 700; line-height: 1.3; }
h3 { font-size: 1.5rem; font-weight: 600; line-height: 1.4; }
h4 { font-size: 1.25rem; font-weight: 600; line-height: 1.4; }
p, body { font-size: 1rem; font-weight: 400; line-height: 1.6; }
small, label { font-size: 0.875rem; font-weight: 500; }
.text-xs { font-size: 0.75rem; }
.monospace { font-family: 'Courier New', monospace; }
```

---

### 1.2 Spacing & Padding Consistency Audit
**Current Issue:** Inconsistent padding/margin throughout components

**Tests to Run:**
- [ ] All Cards use consistent padding (px-6 py-6 = 24px)
- [ ] Section margins are uniform (py-16 to py-24)
- [ ] Button padding follows size spec: sm (px-3 py-2), md (px-4 py-2.5), lg (px-6 py-3)
- [ ] Gap spacing is consistent within component groups (gap-4, gap-6)
- [ ] Mobile padding differs from desktop (px-4 sm:px-6 lg:px-8)
- [ ] Vertical spacing between sections is consistent (8/16/24px)

**Expected Tailwind Scale:**
```
Spacing: 4px (1), 8px (2), 12px (3), 16px (4), 20px (5), 24px (6), 32px (8), 40px (10), 48px (12)
Grid gaps: gap-4 (16px), gap-6 (24px), gap-8 (32px)
```

---

### 1.3 Component Proportionality Audit
**Tests to Run:**

#### Buttons
- [ ] Button heights correct: sm (32px), md (40px), lg (48px)
- [ ] Padding proportional to text size
- [ ] Icon size matches text (18px for md, 20px for lg)
- [ ] Border radius consistent (rounded-xl = 12px)
- [ ] Focus ring offset (ring-offset-2)

#### Input Fields
- [ ] Height matches button (px-4 py-2 = 40px for md)
- [ ] Border width consistent (border-2)
- [ ] Placeholder color proper contrast
- [ ] Label spacing (mb-2)
- [ ] Error text size/color (text-red-500 text-sm)

#### Cards
- [ ] Padding: px-6 py-6 (24px)
- [ ] Header padding: px-6 py-4 (24px x 16px)
- [ ] Border width: border (1px)
- [ ] Shadows proportional (shadow-sm vs shadow-lg)
- [ ] Border radius: rounded-2xl (16px)

#### Icons
- [ ] Small: 16px (labels, nav)
- [ ] Medium: 20px (buttons, cards)
- [ ] Large: 24-28px (hero, feature blocks)
- [ ] XL: 32-40px (empty states)

---

### 1.4 Color Consistency Audit
**Design Palette:**
- Primary Navy: #1A2744 (buttons, headers, text)
- Primary Saffron: #E07B39 (accent, CTAs, highlights)
- Background Light: #EEF1F8 (sections, borders)
- Text Muted: #6B7A9A (secondary text, labels)
- Borders: #D4D8E4 (card borders, dividers)

**Tests to Run:**
- [ ] All navy text uses #1A2744 (not #000 or #111)
- [ ] All saffron accents use #E07B39 (not orange variants)
- [ ] All secondary text uses #6B7A9A (not gray)
- [ ] All section backgrounds use #EEF1F8 (not white)
- [ ] Hover states darken primary by 10% (#d46b2a for saffron)
- [ ] Active states darken by 20% (#c85b1b for saffron)
- [ ] Disabled states use opacity-50
- [ ] Status colors standardized (success: #10b981, warning: #f59e0b, error: #ef4444)

---

### 1.5 Responsive Design Audit
**Tests to Run:**
- [ ] Mobile breakpoint (max-width: 640px): Single column, large touch targets (48px min)
- [ ] Tablet breakpoint (640px-1024px): 2 columns, proper spacing
- [ ] Desktop breakpoint (1024px+): 3-4 columns, max-width containers (1280px)
- [ ] Text sizes adjust: Headings smaller on mobile (-20%), body text consistent
- [ ] Images maintain aspect ratio on all breakpoints
- [ ] Navigation responsive (hamburger menu on mobile)
- [ ] Grid gaps consistent: gap-4 mobile, gap-6 desktop

---

### 1.6 Number & Data Display Consistency
**Tests to Run:**
- [ ] All numbers use monospace font (font-mono)
- [ ] Currency formatted consistently (₹ prefix, no extra decimals)
- [ ] Percentages formatted (87%, not 0.87)
- [ ] Large numbers separated (1,234 not 1234)
- [ ] Dates formatted consistently (DD MMM YYYY format)
- [ ] Time displays with AM/PM or 24h format (consistently)
- [ ] Rating displays (e.g., "4.5 (237 reviews)" with proper spacing)
- [ ] Number alignment in tables/lists (right-aligned for numbers)

---

### 1.7 Visual Hierarchy Audit
**Tests to Run:**
- [ ] Page titles (H1) largest, prominent (2.5rem, bold)
- [ ] Section titles (H2) clearly subordinate (2rem)
- [ ] Card titles (H3) visually grouped (1.5rem)
- [ ] Body text readable on all backgrounds (18px line-height)
- [ ] Primary action button most prominent
- [ ] Secondary actions visually distinct
- [ ] Tertiary actions de-emphasized (ghost variant)
- [ ] Empty states have clear visual focus (large icon + text)

---

## Part 2: SPECIFIC PAGE AUDITS

### 2.1 Login Page (`/login`)
**Issues to Check:**
- [ ] Card width proportional (max-w-md = 448px)
- [ ] Input fields full width with proper spacing
- [ ] Button sizes consistent (size="lg")
- [ ] Demo buttons grid layout (2 columns)
- [ ] Demo info banner color contrast
- [ ] Logo size proportional (text-3xl for login page)
- [ ] Error messages clearly visible
- [ ] Loading spinner size (h-4 w-4)

### 2.2 Dashboard (`/dashboard`)
**Issues to Check:**
- [ ] Welcome text proportions (text-5xl heading)
- [ ] Stats cards alignment (3 columns on desktop, 1 on mobile)
- [ ] Icon sizing in stat cards (24px consistent)
- [ ] Numbers use large bold font (text-3xl)
- [ ] Quick Actions grid (4 columns, proper gaps)
- [ ] Recent Activity list spacing
- [ ] Dividers height (1px consistent)

### 2.3 Case Search (`/case`)
**Issues to Check:**
- [ ] Search input proportional (size:lg buttons)
- [ ] Case header styling (text-3xl for case name)
- [ ] Info grid alignment (2 columns desktop, 1 mobile)
- [ ] Status badge sizing/positioning
- [ ] Hearing history cards consistent spacing
- [ ] Icons aligned (16px for inline, 20px for standalone)

### 2.4 AI Chat (`/chat`)
**Issues to Check:**
- [ ] Layout proportional (lg:col-span-3 vs col-span-1)
- [ ] Message bubbles proper padding (px-4 py-2)
- [ ] Timestamp sizing (text-xs consistent)
- [ ] Input area bottom spacing
- [ ] Chat height fixed (h-[500px] md:h-[600px])
- [ ] Scrollbar visible but not intrusive

### 2.5 Lawyer Marketplace (`/marketplace`)
**Issues to Check:**
- [ ] Lawyer card grid (3 columns desktop, 1 mobile)
- [ ] Card padding consistent (p-6)
- [ ] Rating stars sizing (16px)
- [ ] Experience badge proportional
- [ ] Price display large and clear (text-2xl)
- [ ] Button sizing in cards (size="sm" consistent)
- [ ] Filter bar spacing and alignment

---

## Part 3: IMPLEMENTATION FIXES

### Fix 1: Add Typography System to globals.css
```css
@layer base {
  h1 { @apply text-[2.5rem] font-bold leading-tight tracking-tight; }
  h2 { @apply text-[2rem] font-bold leading-snug; }
  h3 { @apply text-[1.5rem] font-semibold leading-snug; }
  h4 { @apply text-[1.25rem] font-semibold leading-snug; }
  p { @apply text-base leading-relaxed; }
  small { @apply text-sm font-medium; }
  .text-muted { @apply text-[#6B7A9A]; }
  .number { @apply font-mono; }
  .currency { @apply font-mono font-semibold; }
}
```

### Fix 2: Standardize Component Padding
Replace inconsistent padding with:
- Cards: `px-6 py-6`
- Card Headers: `px-6 py-4`
- Card Content: `px-6 py-4`
- Card Footer: `px-6 py-4`

### Fix 3: Standardize Button Sizes
```
sm:  px-3 py-2 text-sm (height: 32px)
md:  px-4 py-2.5 text-base (height: 40px)
lg:  px-6 py-3 text-base (height: 48px)
```

### Fix 4: Fix Icon Sizing
- Inline labels: 14px (size={14})
- Button icons: 18px for md, 20px for lg
- Card icons: 20-24px
- Feature icons: 28px
- Hero icons: 32-40px
- Empty states: 48px

### Fix 5: Standardize Color Usage
Search/replace in all files:
- `text-gray-600` → `text-[#6B7A9A]`
- `text-gray-300` → `text-[#D4D8E4]`
- `bg-gray-100` → `bg-[#EEF1F8]`
- `border-gray-300` → `border-[#D4D8E4]`

### Fix 6: Fix Number Formatting
```
// In components displaying numbers:
<span className="font-mono font-semibold">
  {number.toLocaleString('en-IN')}
</span>
```

### Fix 7: Standardize Spacing
- Section padding: `py-16 md:py-24`
- Container padding: `px-4 sm:px-6 lg:px-8`
- Component gaps: `gap-4` (small), `gap-6` (medium)
- Grid gaps: same as component gaps

---

## Part 4: TESTING METHODOLOGY

### Manual Testing Script
1. **Desktop (1920x1080)**
   - [ ] All text readable
   - [ ] All buttons clickable (48px min touch target)
   - [ ] No overflow on any element
   - [ ] Spacing looks balanced

2. **Tablet (768x1024)**
   - [ ] Single column layout works
   - [ ] Touch targets adequate (48px)
   - [ ] Text resizes properly
   - [ ] Spacing doesn't feel cramped

3. **Mobile (375x667)**
   - [ ] Hamburger menu functional
   - [ ] Single column layout
   - [ ] Touch targets 48px minimum
   - [ ] No horizontal scroll
   - [ ] Modals/dialogs fit screen

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Accessibility Testing
- [ ] Color contrast (WCAG AA minimum)
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] Alt text on all images

---

## Part 5: DELIVERABLES

1. **Updated globals.css** with typography system
2. **Updated Tailwind config** with consistent spacing scale
3. **Fixed all component padding** (Button.tsx, Card.tsx, Input.tsx)
4. **Updated all page layouts** for proportionality
5. **Color palette standardization** across all files
6. **Number formatting utilities** for consistent display
7. **Responsive design fixes** for all breakpoints
8. **Documentation** of the new design system

---

## Acceptance Criteria

- [ ] All headings follow typography scale
- [ ] All spacing uses consistent 4px grid (4,8,12,16,24,32 units)
- [ ] All buttons have proper sizing (sm/md/lg)
- [ ] All colors from palette only
- [ ] All numbers formatted with thousands separator and monospace
- [ ] Mobile, tablet, desktop all proportional
- [ ] WCAG AA color contrast on all text
- [ ] No hardcoded pixel values (use Tailwind classes)
- [ ] Consistent hover/active/focus states
- [ ] All component padding unified (px-6 py-6 for cards)

---

## Files to Modify Priority

**High Priority:**
1. `globals.css` - Add typography system
2. `Button.tsx` - Fix padding/sizing
3. `Input.tsx` - Fix height/padding
4. `Card.tsx` - Standardize padding
5. `page.tsx` (home) - Fix all text sizes and spacing

**Medium Priority:**
6. `dashboard/page.tsx` - Stats card alignment
7. `case/page.tsx` - Data display formatting
8. `chat/page.tsx` - Layout proportions

**Low Priority:**
9. All other component pages
10. Responsive breakpoint tweaks

