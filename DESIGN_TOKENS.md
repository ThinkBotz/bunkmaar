# 🎨 Quick Reference: Design Tokens

## 🔮 Glassmorphism Recipe

### Standard Card
```tsx
className="
  bg-card/40 dark:bg-card/30
  backdrop-blur-2xl
  backdrop-saturate-180
  shadow-card
  rounded-2xl
  border-0
"
```

### With Gradient Overlay
```tsx
<Card className="relative overflow-hidden bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card border-0">
  {/* Gradient overlay for depth */}
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
  
  {/* Your content */}
  <div className="relative p-5 xs:p-6">
    ...
  </div>
</Card>
```

---

## 🎯 Semantic Color Tints

### Success (Green)
```tsx
className="bg-success/15 dark:bg-success/20 text-success border-success/30"
```

### Warning (Orange)
```tsx
className="bg-warning/15 dark:bg-warning/20 text-warning border-warning/30"
```

### Destructive (Red)
```tsx
className="bg-destructive/15 dark:bg-destructive/20 text-destructive border-destructive/30"
```

### Primary (Blue)
```tsx
className="bg-primary/10 dark:bg-primary/15 text-primary border-primary/30"
```

### Neutral (Gray)
```tsx
className="bg-neutral/15 dark:bg-neutral/20 text-neutral border-neutral/30"
```

---

## 💫 Animation Patterns

### Hover Elevation
```tsx
className="
  transition-all duration-300 ease-smooth
  hover:scale-[1.01]
  hover:shadow-elevated
"
```

### Button Press (Haptic)
```tsx
className="
  transition-all duration-200 ease-smooth
  active:scale-95
"
```

### Bounce Effect
```tsx
className="
  transition-all duration-300 ease-bounce
  active:scale-95
"
```

### Pulse Attention
```tsx
className="animate-pulse"
```

---

## 🏷️ iOS-Style Badges

### Percentage Badge
```tsx
<div className="
  px-4 xs:px-5 py-2 xs:py-2.5
  rounded-2xl
  font-semibold text-base xs:text-lg
  bg-success/15 dark:bg-success/20
  text-success
  backdrop-blur-xl
  shadow-lg
">
  <span className="tabular-nums">95.5%</span>
  <span className="ml-1.5 text-xs font-medium opacity-80">Overall</span>
</div>
```

### Status Badge
```tsx
<span className="
  inline-flex items-center
  px-2.5 py-1
  rounded-full
  text-xs font-medium
  bg-success/15 dark:bg-success/20
  text-success
  backdrop-blur-xl
">
  Present
</span>
```

---

## 🎨 Button Styles

### Primary Action (iOS Blue)
```tsx
<Button className="
  bg-primary hover:bg-primary/90
  text-primary-foreground
  rounded-xl
  shadow-lg
  transition-all duration-200 ease-smooth
  active:scale-95
">
  Submit
</Button>
```

### Semantic Button (Success)
```tsx
<Button className="
  bg-success/15 hover:bg-success/25
  dark:bg-success/20 dark:hover:bg-success/30
  text-success
  border-0
  shadow-lg
  rounded-2xl
  transition-all duration-300 ease-bounce
  active:scale-95
">
  <Check className="h-5 w-5" />
  <span className="text-xs font-medium">Confirm</span>
</Button>
```

### Ghost Button
```tsx
<Button className="
  bg-transparent
  hover:bg-card/40 dark:hover:bg-card/30
  hover:backdrop-blur-xl
  rounded-xl
  transition-all duration-300
">
  Cancel
</Button>
```

---

## 📐 Spacing Scale

### Micro Spacing (Related Elements)
```tsx
gap-1      // 4px
gap-2      // 8px
```

### Small Spacing (Icons to Labels)
```tsx
gap-2      // 8px
gap-3      // 12px
```

### Medium Spacing (Cards)
```tsx
gap-4      // 16px
gap-5      // 20px
space-y-4  // 16px vertical
space-y-5  // 20px vertical
```

### Large Spacing (Sections)
```tsx
gap-6      // 24px
gap-8      // 32px
space-y-6  // 24px vertical
```

### Card Padding
```tsx
p-4 xs:p-5 sm:p-6 md:p-8
// Mobile: 16px → 20px → 24px → 32px
```

---

## 🎭 Shadow Levels

### Resting
```tsx
className="shadow-card"
```

### Hover
```tsx
className="shadow-card hover:shadow-elevated"
```

### Glassmorphic
```tsx
className="shadow-glass"
```

### Semantic Glow
```tsx
className="shadow-lg shadow-success/20"
```

---

## 🔤 Typography Scale

### Headings
```tsx
<h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight">
  Hero Heading
</h1>

<h2 className="text-xl xs:text-2xl sm:text-3xl font-bold tracking-tight">
  Page Title
</h2>

<h3 className="text-lg xs:text-xl font-semibold">
  Section Heading
</h3>
```

### Body Text
```tsx
<p className="text-sm xs:text-base text-muted-foreground">
  Primary body text
</p>

<p className="text-xs xs:text-sm text-muted-foreground font-medium">
  Secondary text
</p>
```

### Labels & Captions
```tsx
<span className="text-[10px] xs:text-xs font-medium">
  Micro label
</span>

<span className="text-xs font-medium opacity-80">
  Caption
</span>
```

---

## 🌈 Border Radius Scale

### Small (Compact Elements)
```tsx
rounded-lg      // 0.75rem (12px)
rounded-xl      // 1rem (16px)
```

### Medium (Cards, Buttons)
```tsx
rounded-2xl     // 1.25rem (20px)
```

### Large (Containers)
```tsx
rounded-3xl     // 1.5rem (24px)
```

### Pills
```tsx
rounded-full    // Full rounding
```

---

## 🎬 Transition Timing

### Fast (Micro-interactions)
```tsx
duration-150    // 150ms
duration-200    // 200ms
```

### Standard (Most interactions)
```tsx
duration-300    // 300ms
```

### Slow (Elevation changes)
```tsx
duration-500    // 500ms
```

### Easing Functions
```tsx
ease-smooth     // cubic-bezier(0.4, 0, 0.2, 1)
ease-bounce     // cubic-bezier(0.34, 1.56, 0.64, 1)
ease-spring     // cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

---

## 🎯 Touch Target Optimization

### Minimum Size
```tsx
className="min-h-[44px] min-w-[44px]"  // Apple HIG standard
```

### Touch Action
```tsx
className="touch-manipulation"  // Prevents double-tap zoom
```

### Tap Highlight
```css
-webkit-tap-highlight-color: transparent;  // In CSS
```

---

## 🌓 Dark Mode Variants

### Automatic Switching
```tsx
className="bg-card/40 dark:bg-card/30"
className="text-foreground dark:text-foreground"
className="border-white/10 dark:border-white/5"
```

### Opacity Adjustments
- Light mode: Lower opacity (30%, 40%)
- Dark mode: Higher opacity (50%, 60%)

### Color Temperature
- Light mode: Cooler tones
- Dark mode: Warmer tones

---

## 📱 Responsive Breakpoints

### Progressive Scaling
```tsx
// Font Size
className="text-sm xs:text-base sm:text-lg md:text-xl"

// Padding
className="p-4 xs:p-5 sm:p-6 md:p-8"

// Gap
className="gap-3 xs:gap-4 sm:gap-5 md:gap-6"

// Width
className="w-full sm:w-auto"
```

---

## 🔧 Utility Combinations

### Floating Card (Complete)
```tsx
className="
  relative overflow-hidden group
  bg-card/40 dark:bg-card/30
  backdrop-blur-2xl backdrop-saturate-180
  shadow-card hover:shadow-elevated
  rounded-2xl border-0
  transition-all duration-300 ease-smooth
  hover:scale-[1.01] active:scale-[0.99]
  p-4 xs:p-5
"
```

### iOS Navigation Bar (Complete)
```tsx
className="
  fixed bottom-0 left-0 right-0 z-50
  bg-card/70 dark:bg-card/60
  backdrop-blur-2xl backdrop-saturate-180
  border-t border-white/10 dark:border-white/5
  supports-[safe-area-inset-bottom]:pb-[env(safe-area-inset-bottom)]
"
```

### Action Button Grid (Complete)
```tsx
<div className="grid grid-cols-4 gap-2 xs:gap-3">
  <Button className="
    flex flex-col items-center gap-2
    h-auto py-3 xs:py-4 px-2
    bg-success/15 hover:bg-success/25
    dark:bg-success/20 dark:hover:bg-success/30
    text-success border-0 shadow-lg
    rounded-2xl
    transition-all duration-300 ease-bounce
    active:scale-95
  ">
    <Icon className="h-5 w-5 xs:h-6 xs:w-6" />
    <span className="text-[10px] xs:text-xs font-medium">Label</span>
  </Button>
</div>
```

---

## 💡 Pro Tips

### 1. Always Layer Shadows
Don't use single shadows. Use multi-layer for depth:
```tsx
shadow-card    // 3 layers: diffuse + diffuse + border
```

### 2. Add Gradient Overlays
Never leave glassmorphic cards flat:
```tsx
<div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
```

### 3. Use Tabular Numbers
For consistent width in dynamic numbers:
```tsx
<span className="tabular-nums">95.5%</span>
```

### 4. Progressive Enhancement
Mobile-first, then enhance:
```tsx
className="text-sm xs:text-base sm:text-lg"
```

### 5. Semantic Tints
Use 15/20 opacity for light/dark:
```tsx
className="bg-success/15 dark:bg-success/20"
```

### 6. Touch Feedback
Always provide scale feedback:
```tsx
className="active:scale-95"
```

### 7. Smooth Transitions
300ms is the sweet spot:
```tsx
className="transition-all duration-300 ease-smooth"
```

### 8. Backdrop Effects
Combine blur with saturation:
```tsx
className="backdrop-blur-2xl backdrop-saturate-180"
```

---

## 🎨 Copy-Paste Components

### Glassmorphic Header Card
```tsx
<Card className="relative overflow-hidden border-0 bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card hover:shadow-elevated transition-all duration-500 ease-smooth">
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
  <div className="relative p-5 xs:p-6 sm:p-7">
    <div className="flex items-center justify-between gap-4">
      <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
        Title
      </h2>
      <div className="px-4 xs:px-5 py-2 xs:py-2.5 rounded-2xl font-semibold text-base xs:text-lg bg-primary/10 dark:bg-primary/15 text-primary backdrop-blur-xl shadow-lg">
        Badge
      </div>
    </div>
  </div>
  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
</Card>
```

### Floating Action Card
```tsx
<Card className="relative overflow-hidden group border-0 bg-card/40 dark:bg-card/30 backdrop-blur-2xl backdrop-saturate-180 shadow-card hover:shadow-elevated transition-all duration-300 ease-smooth hover:scale-[1.01] active:scale-[0.99]">
  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none" />
  <div className="relative p-4 xs:p-5">
    {/* Your content */}
  </div>
</Card>
```

### iOS-Style Button
```tsx
<Button className="flex flex-col items-center gap-2 h-auto py-3 xs:py-4 px-2 bg-success/15 hover:bg-success/25 dark:bg-success/20 dark:hover:bg-success/30 text-success border-0 shadow-lg rounded-2xl transition-all duration-300 ease-bounce active:scale-95">
  <CheckIcon className="h-5 w-5 xs:h-6 xs:w-6" />
  <span className="text-[10px] xs:text-xs font-medium">Label</span>
</Button>
```

---

**Remember:** Every design choice should enhance both aesthetics and usability. When in doubt, refer back to these tokens to maintain consistency across the entire application.
