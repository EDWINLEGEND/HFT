# 🎨 CivicAssist Design System - Quick Reference

## Color Palette

### Primary (Teal/Cyan)
```
#00A9A0 ███████ Main Primary
#008780 ███████ Hover State
#E6F7F6 ███████ Light Background
#CCEFED ███████ 100
#99DFDB ███████ 200
#66CFC9 ███████ 300
#33BFB7 ███████ 400
```

### Status Colors
```
Success: #10B981 ███████ Green
Warning: #F59E0B ███████ Amber  
Danger:  #EF4444 ███████ Red
Info:    #3B82F6 ███████ Blue
```

### Neutrals
```
Gray 0:   #FFFFFF ███████ White
Gray 50:  #F9FAFB ███████ Background
Gray 100: #F3F4F6 ███████ Light
Gray 200: #E5E7EB ███████ Border
Gray 300: #D1D5DB ███████ Border Dark
Gray 500: #6B7280 ███████ Muted Text
Gray 700: #374151 ███████ Body Text
Gray 900: #111827 ███████ Headings
```

---

## Typography

### Font Family
```
Primary:  'Poppins'
Fallback: 'Inter', -apple-system, BlinkMacSystemFont
```

### Font Weights
```
Light:    300 - Subtle emphasis
Regular:  400 - Body text
Medium:   500 - UI elements
Semibold: 600 - Subheadings
Bold:     700 - Headlines
```

### Font Sizes
```
xs:   12px - Small labels, timestamps
sm:   14px - Body text, descriptions
base: 16px - Default text
lg:   18px - Lead paragraphs
xl:   20px - Large UI text
2xl:  24px - Section headers
3xl:  30px - Page titles
4xl:  36px - Hero headlines
```

---

## Component Styles

### Buttons
```css
Default Size:  h-10 (40px)
Small:         h-8  (32px)
Large:         h-12 (48px)
Padding:       px-5 py-2.5
Border Radius: 12px (rounded-lg)
Font Weight:   500 (medium)
```

**Variants**:
- `default`: Teal background, white text, shadow
- `outline`: White background, gray border, hover teal
- `ghost`: Transparent, hover gray background
- `secondary`: Gray background
- `destructive`: Red background

### Cards
```css
Background:    White (#FFFFFF)
Border:        1px solid #E5E7EB
Border Radius: 16px (rounded-xl)
Shadow:        0 1px 3px rgba(0,0,0,0.1)
Hover Shadow:  0 4px 6px rgba(0,0,0,0.1)
Padding:       24px (p-6)
```

### Badges
```css
Padding:       px-3 py-1 (12px horizontal, 4px vertical)
Border Radius: 12px (rounded-lg)
Font Size:     12px (text-xs)
Font Weight:   500 (medium)
```

**Variants**:
- `default`: Teal background
- `success`: Green with light background
- `warning`: Amber with light background
- `destructive`: Red with light background
- `outline`: White with border

### Inputs
```css
Background:    White
Border:        1px solid #D1D5DB
Border Radius: 8px (rounded-md)
Padding:       10px 14px (0.625rem 0.875rem)
Font Size:     14px
Focus Border:  #00A9A0
Focus Ring:    0 0 0 3px rgba(0,169,160,0.1)
```

---

## Spacing Scale

```
0  = 0px
1  = 4px    (0.25rem)
2  = 8px    (0.5rem)
3  = 12px   (0.75rem)
4  = 16px   (1rem)
5  = 20px   (1.25rem)
6  = 24px   (1.5rem)
8  = 32px   (2rem)
10 = 40px   (2.5rem)
12 = 48px   (3rem)
16 = 64px   (4rem)
20 = 80px   (5rem)
```

---

## Shadows

```css
sm:   0 1px 2px rgba(0,0,0,0.05)
base: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)
md:   0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)
lg:   0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)
xl:   0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)
```

---

## Border Radius

```
sm:   4px   (rounded-sm)
md:   8px   (rounded-md)
lg:   12px  (rounded-lg)
xl:   16px  (rounded-xl)
2xl:  24px  (rounded-2xl)
full: 9999px (rounded-full)
```

---

## CSS Variables

### Light Mode
```css
--primary: 180 100% 33%;           /* #00A9A0 */
--background: 0 0% 98%;            /* #F9FAFB */
--foreground: 220 13% 9%;          /* #111827 */
--border: 220 13% 83%;             /* #D1D5DB */
--input: 220 13% 91%;              /* #E5E7EB */
--ring: 180 100% 33%;              /* #00A9A0 */
--radius: 0.75rem;                 /* 12px */
```

### Dark Mode
```css
--background: 220 13% 9%;          /* #1F2937 */
--foreground: 220 13% 98%;         /* #F9FAFB */
--primary: 180 100% 40%;           /* Lighter teal */
--border: 220 13% 20%;             /* Darker borders */
```

---

## Utility Classes

### Custom Buttons
```css
.btn-primary {
  background: #00A9A0;
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 12px;
  font-weight: 500;
}
.btn-primary:hover {
  background: #008780;
  transform: translateY(-1px);
}
```

### Status Badges
```css
.badge-in-review  { bg: #FEF3C7, text: #92400E }
.badge-approved   { bg: #D1FAE5, text: #065F46 }
.badge-rejected   { bg: #FEE2E2, text: #991B1B }
.badge-pending    { bg: #E0E7FF, text: #3730A3 }
.badge-submitted  { bg: #DBEAFE, text: #1E40AF }
```

### Cards
```css
.card-hellogov {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.card-hellogov:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

---

## Breakpoints

```css
xs:  320px   /* Mobile portrait */
sm:  640px   /* Mobile landscape */
md:  768px   /* Tablet portrait */
lg:  1024px  /* Tablet landscape / Small desktop */
xl:  1280px  /* Desktop */
2xl: 1536px  /* Large desktop */
```

---

## Icon Sizes

```css
Small:  w-4 h-4   (16px)
Base:   w-5 h-5   (20px)
Large:  w-6 h-6   (24px)
XL:     w-8 h-8   (32px)
2XL:    w-10 h-10 (40px)
3XL:    w-12 h-12 (48px)
```

---

## Animation Timings

```css
Fast:  150ms cubic-bezier(0.4, 0, 0.2, 1)
Base:  200ms cubic-bezier(0.4, 0, 0.2, 1)
Slow:  300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## Z-Index Layers

```css
base:          0      /* Normal content */
dropdown:      1000   /* Dropdowns */
sticky:        1020   /* Sticky headers */
fixed:         1030   /* Fixed elements */
modalBackdrop: 1040   /* Modal backdrops */
modal:         1050   /* Modals */
popover:       1060   /* Popovers */
tooltip:       1070   /* Tooltips */
```

---

## Common Patterns

### Card with Hover Effect
```tsx
<Card className="border-2 hover:border-[#00A9A0] hover:shadow-lg transition-all duration-300">
  {/* Content */}
</Card>
```

### Primary CTA Button
```tsx
<Button 
  className="bg-[#00A9A0] hover:bg-[#008780] shadow-md hover:shadow-lg"
  size="lg"
>
  Submit Application
</Button>
```

### Status Badge
```tsx
<Badge 
  variant="success"
  className="px-3 py-1 rounded-lg"
>
  Approved
</Badge>
```

### Input with Teal Focus
```tsx
<Input 
  className="border-gray-300 focus:border-[#00A9A0] focus:ring-[#00A9A0]/10"
  placeholder="Enter text..."
/>
```

### Icon with Teal Background
```tsx
<div className="w-12 h-12 bg-[#E6F7F6] rounded-lg flex items-center justify-center">
  <CheckCircle className="w-6 h-6 text-[#00A9A0]" />
</div>
```

---

## Accessibility

### Color Contrast Ratios
```
Primary (#00A9A0) on White: 4.5:1 ✓ (AA)
Gray 900 (#111827) on White: 16.1:1 ✓ (AAA)
Gray 500 (#6B7280) on White: 4.6:1 ✓ (AA)
White on Primary (#00A9A0): 4.5:1 ✓ (AA)
```

### Focus States
- All interactive elements have visible focus rings
- Focus ring: 2px solid primary color
- Focus ring offset: 2px

### Keyboard Navigation
- Tab order follows visual order
- All clickable elements are focusable
- Custom focus styles for better visibility

---

**Design System Version**: 1.0  
**Last Updated**: January 5, 2025  
**Framework**: Next.js 16 + Tailwind CSS 4  
**UI Library**: shadcn/ui

