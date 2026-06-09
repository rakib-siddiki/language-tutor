## What to build

Initialize shadcn/ui in `apps/web` and set up the global design system. This is the visual foundation that all subsequent frontend feature slices depend on.

**Steps:**
1. Run `npx shadcn@latest init` in `apps/web` with the `nova` preset and Tailwind v4, targeting the Next.js App Router template.
2. Install the core set of shadcn components needed across features: `button`, `card`, `badge`, `dialog`, `sheet`, `tooltip`, `popover`, `progress`, `skeleton`, `separator`, `alert`, `tabs`, `scroll-area`, `toggle-group`.
3. Configure the global CSS file with the design tokens: dark-mode support via `data-theme="dark"`, custom CSS variables for the tutor's brand palette (deep navy background, accent gradients), and the `Outfit` + `Inter` Google Fonts.
4. Create a root `ThemeProvider` component in `apps/web/src/components/providers/ThemeProvider.tsx` that wraps the app and exposes a `useTheme` hook for toggling dark/light mode. The selected theme is persisted in `localStorage`.
5. Update `apps/web/src/app/layout.tsx` to use the `ThemeProvider`, import Google Fonts, and set SEO metadata (title, description, viewport).

The result is a styled shell app with dark mode toggleable from a `ThemeToggle` button rendered in the top navigation bar.

## Acceptance criteria

- [ ] `components.json` is present in `apps/web` and correctly configured with the `nova` preset.
- [ ] All listed shadcn components are installed and importable.
- [ ] Global CSS defines CSS custom properties for light and dark themes.
- [ ] `ThemeProvider` wraps the app and persists theme to `localStorage`.
- [ ] `ThemeToggle` button is visible in the layout and correctly switches between light and dark.
- [ ] The app loads without console errors or TypeScript errors.
- [ ] Google Fonts (`Outfit`, `Inter`) are loaded and applied as the base font.
- [ ] Root `<html>` tag has `lang="en"` and correct `<meta>` viewport tag.

## Blocked by

- `01-nx-monorepo-scaffold.md`

## Status
Pending
