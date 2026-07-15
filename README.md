# Sistema Getsemaní

App de gestión interna (productos, ventas, cargas de stock, vendedores, etc.), construida en React + Vite + Supabase.

## Stack
- React 19 + Vite 8 + Tailwind CSS 4 + React Router 7
- Supabase (DB + Auth) y TanStack Query

## Setup
```bash
pnpm install
cp .env.local.example .env.local # completar con credenciales Supabase
pnpm dev
```

## Scripts
```bash
pnpm dev # dev server
pnpm build # build producción
pnpm lint # ESLint
pnpm preview # preview del build
```

## Estructura
```
src/
|
|--- components/ui/ # Componentes compartidos (Sidebar, Loader, etc.)
|--- core/  # providers, hooks y servicios transversales
|--- features/  # modulos por dominio
    |-- login/  # (feat/login)
    |-- products/
    |-- sales/
    |-- stockLoad/
    |-- vendors/
|-- router/ # routes y guards (ProtectedRoute, PublicOnlyRoute)
|-- assets/ # logo, imágenes, etc.
|-- specs/  # specs de cada feature
```
