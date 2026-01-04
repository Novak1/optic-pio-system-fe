# Tailwind CSS Configuration

This document describes the Tailwind CSS setup and customizations for the Optic app.

## Overview

The app uses **Tailwind CSS v4.1.17** with a custom configuration that includes:
- Custom color palettes (primary, secondary, success, danger, warning)
- Extended spacing, border radius, and shadow utilities
- Custom animations and keyframes
- Dark mode support
- Custom utility classes

## Color Palette

### Primary (Blue)
Used for primary actions, links, and brand elements.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Example: `bg-primary-600`, `text-primary-500`

### Secondary (Slate)
Used for secondary actions and neutral elements.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Example: `bg-secondary-200`, `text-secondary-600`

### Success (Green)
Used for success states and positive feedback.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Example: `bg-success-600`, `text-success-700`

### Danger (Red)
Used for error states, warnings, and destructive actions.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Example: `bg-danger-600`, `text-danger-500`

### Warning (Amber)
Used for warning states and caution messages.
- Shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
- Example: `bg-warning-600`, `text-warning-500`

## Custom Utilities

### Layout
- `.flex-center` - Flexbox with centered items
- `.flex-between` - Flexbox with space-between
- `.container-app` - Container with responsive padding

### Typography
- `.text-gradient` - Gradient text effect
- `.truncate-2` - Truncate text to 2 lines
- `.truncate-3` - Truncate text to 3 lines

### Effects
- `.glass` - Glass morphism effect
- `.card-shadow` - Card shadow with hover effect
- `.transition-smooth` - Smooth transition for all properties

### Backgrounds
- `.bg-gradient-primary` - Primary gradient background
- `.bg-gradient-secondary` - Secondary gradient background

### Scrollbar
- `.scrollbar-hide` - Hide scrollbar but keep functionality

## Custom Animations

Available custom animations:
- `animate-fade-in` - Fade in effect (0.3s)
- `animate-fade-out` - Fade out effect (0.3s)
- `animate-slide-in-right` - Slide in from right (0.3s)
- `animate-slide-in-left` - Slide in from left (0.3s)
- `animate-slide-up` - Slide up from bottom (0.3s)
- `animate-bounce-slow` - Slow bounce (2s infinite)
- `animate-pulse-slow` - Slow pulse (3s infinite)

## Dark Mode

Dark mode is configured with the `class` strategy. Add the `dark:` prefix to any utility class to apply it only in dark mode.

### Example
```tsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### Using the Dark Mode Hook
```tsx
import { useDarkMode } from "@/hooks/useDarkMode";

function ThemeToggle() {
  const { isDarkMode, toggle } = useDarkMode();
  
  return (
    <button onClick={toggle}>
      {isDarkMode ? "Light Mode" : "Dark Mode"}
    </button>
  );
}
```

## Custom Spacing

Extended spacing values:
- `18` - 4.5rem (72px)
- `88` - 22rem (352px)
- `100` - 25rem (400px)
- `112` - 28rem (448px)
- `128` - 32rem (512px)

## Custom Border Radius

Extended border radius:
- `4xl` - 2rem (32px)
- `5xl` - 2.5rem (40px)

## Custom Box Shadows

Custom shadow utilities:
- `shadow-soft` - Subtle soft shadow
- `shadow-medium` - Medium shadow
- `shadow-hard` - Strong shadow

## Font Configuration

The app uses the **Inter** font family as the default sans-serif font, with fallbacks to system fonts for optimal performance.

## Component Patterns

### Button Variants
- `variant="primary"` - Primary blue button
- `variant="secondary"` - Secondary gray button
- `variant="danger"` - Red danger button
- `variant="success"` - Green success button
- `variant="warning"` - Amber warning button
- `variant="ghost"` - Transparent ghost button

### Card Variants
- `variant="default"` - Standard card with shadow
- `variant="elevated"` - Card with elevated shadow
- `variant="outlined"` - Card with border outline
- `variant="glass"` - Glass morphism card

### Component Sizes
Most components support these sizes:
- `xs` - Extra small
- `sm` - Small
- `md` - Medium (default)
- `lg` - Large
- `xl` - Extra large

## Best Practices

1. **Use semantic colors**: Use the custom color palettes (primary, success, etc.) instead of generic colors (blue, green) for better consistency.

2. **Dark mode first**: Always include dark mode variants when styling components.

3. **Responsive design**: Use responsive prefixes (`sm:`, `md:`, `lg:`, etc.) for mobile-first design.

4. **Utility composition**: Use the `cn()` utility function to compose class names:
   ```tsx
   import { cn } from "@/utils/cn";
   
   <div className={cn("base-class", isActive && "active-class", className)} />
   ```

5. **Custom utilities**: Prefer custom utility classes (like `.flex-center`) for commonly used patterns.

## Configuration Files

- **tailwind.config.ts** - Main Tailwind configuration
- **postcss.config.js** - PostCSS configuration
- **src/index.css** - Global styles and custom utilities
- **src/styles/themes/index.ts** - Theme tokens and types
- **src/utils/cn.ts** - Class name utility function

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Migration Guide](https://tailwindcss.com/docs/v4-beta)
- [Dark Mode Guide](https://tailwindcss.com/docs/dark-mode)

