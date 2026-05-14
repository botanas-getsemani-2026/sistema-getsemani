# Sistema Getsemaní

## Dev Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Lint (ESLint)
npm run preview  # Preview production build
```

## Tailwind CSS 4

Custom theme defined in `src/index.css` using `@theme` directive. App uses a dark theme with custom color tokens:

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#98D5A4` | Accent/action buttons |
| `secondary` | `#B7CCB8` | Secondary elements |
| `tertiary` | `#A2CED9` | Tertiary/highlight |
| `sidebar` | `#1d2331` | Sidebar background |
| `background`/`surface` | `#101510` | Page background |

Colors have container variants (`-container`) and on-color variants (`on-[color]`).

## Architecture - Feature-based Arquitechture

- Entry: `src/main.jsx` → `src/App.jsx`
- Components: `src/components/` (Sidebar.jsx with collapsible context)
- Assets: `src/assets/` (logo, images)
- Specs: `specs/*.md` for feature requirements
- Core: `src/core/` for shared utilities in the app
- Features: `src/features/` for feature-specific components and logic

## Workflow

1. Feature specs stored in `specs/` directory
2. UI follows dark theme with green accent palette
3. Components use Tailwind utility classes + custom theme colors