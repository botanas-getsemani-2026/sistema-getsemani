# Spec: Módulo de productos (CRUD)

## User Story
Como usuario quiero gestionar el catálogo de productos: crear nuevos productos, editar
los existentes y editar los que ya no se ofrecen.

## Requisitos funcionales

### Página de catálogo
- Nueva ruta `/productos` accesible desde el Sidebar.
- La página muestra una tabla con todos los productos ordenados por nombre.
- Columnas: código, nombre, precio, granel (Sí/No), acciones (editar).
- Filtro por nombre y para código (case-insensitive), filtro por tipo (todos / granel / pieza) y filtro por estado (activo, inactivo o descontinuardo).
- Botón "Nuevo producto" en el encabezado.

### Crear producto
- Modal con formulario: código, nombre, precio, granel, estado.
- Validaciones en cliente:
  - código requerido.
  - nombre requerido.
  - precio > 0.
- La unicidad del `codigo` la garantiza el backend mediante el constraint
  `productos_codigo_key`. Si el INSERT falla por duplicado (código `23505`
  de Postgres), mostrar el mensaje "Ya existe un producto con ese código."
- Al guardar, llamar a `INSERT` en `productos` e invalidar la query `['products', 'paginated']`.

### Editar producto
- Botón "Editar" en cada fila.
- Mismo modal en modo edición, con los campos precargados.
- Al guardar, llamar a `UPDATE` en `productos` filtrando por `id`.
- Invalidar la query `['products', 'paginated']`.

### Estados del producto
- En la edición/creación del producto debe aparecer el estado del producto (activo, por defecto)
- Los estados se deben presentar en un elemento <select> y debe ser editable
- el producto tendra 3 estados
  - activo
  - inactivo
  - descontinuado
- Crea una carpeta en `src/constants/products.js`, donde iran las constantes ya mensionadas para exportarlas en donde
sean necesario.
```javascript
export const PRODUCTS_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo',
  DISCONTINUED: 'descontinuado'
};
```

### Visualizar los productos
- Al ingresar en `/productos` se debe visualizar una tabla con los registros del catálogo.

### Paginación
- La paginación debe ser similar a la de `/ventas`
- En el pie de la tabla se deben mostrar los controles de paginación:
  - Selector de tamaño de página (50/ 75 / 100).
  - Texto informativo: "Mostrando X–Y de Z".
  - Botón « (primera página).
  - Botón ‹ (página anterior).
  - Indicador de página actual y total de páginas.
  - Botón › (página siguiente).
  - Botón » (última página).
- El botón « y ‹ deben estar deshabilitados en la primera página.
- El botón › y » deben estar deshabilitados en la última página.
- Mientras se está trayendo una nueva página, mostrar un indicador discreto de carga (por ejemplo, opacidad reducida o un spinner pequeño).
- Al cambiar de filtro, resetear a la primera página.
- Al cambiar el tamaño de página, resetear a la primera página.

## Aclaraciones técnicas (post-construcción)
- Los filtros (nombre, código, tipo, estado) se aplican **en el servidor**
  (Supabase) mediante la query, no en el cliente. El total de la paginación
  refleja la cantidad de filas **después de aplicar los filtros**.
- La búsqueda por texto es case-insensitive usando `ilike` de Postgres.
- El estado de loading durante el cambio de página usa `placeholderData:
  keepPreviousData` de TanStack Query para mantener visible la página
  anterior mientras llega la nueva.
- `staleTime: Infinity` queda descartado; se usa `placeholderData` en su lugar.
- Se mantienen dos hooks separados:
  - `useProducts(filters, page, pageSize)` en
    `src/features/products/data/products.js` — paginado, con filtros en
    servidor. Usado por `ProductsPage`.
  - `useAllProducts()` en `src/core/services/products.js` — sin paginar,
    trae todos los productos. Usado por `AddProductModal` (en `/cargas`),
    donde el dropdown necesita el catálogo completo.
- `queryKey` de TanStack Query:
  - `useAllProducts`: `['products', 'all']`.
  - `useProducts` paginado: `['products', 'paginated', filters, page, pageSize]`.
- `ProductFormModal` ya no valida unicidad de `codigo` en cliente (imposible
  con paginación); captura el error 23505 de Supabase y lo muestra inline.


## Contexto Técnico
- Stack: React 19, Tailwind CSS 4, Supabase, TanStack Query, React Router 7.
- Mantener el patrón feature-based usado en `stockLoad`.
- Reusar `ConfirmModal` y `useToast` (promoverlos a `core/` o `components/ui/` y `hooks/`).
- Diseño de la tabla `public.productos` (de `feat-productsCatalog.md`):
```sql
create table public.productos (
  id uuid not null default gen_random_uuid (),
  codigo text not null,
  nombre text not null,
  precio bigint not null,
  es_a_granel boolean not null default false,
  logo_res text not null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  estado text not null default 'activo'::text,
  constraint productos_pkey primary key (id),
  constraint productos_codigo_key unique (codigo),
  constraint estadochk check (
    (
      estado = any (
        array[
          'activo'::text,
          'inactivo'::text,
          'descontinuado'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;
```
- La columna `logo_res` puede recibir un string vacío en este pase (subida de
  imagen queda para una spec futura).
- FK desde `cargas_detalles.id_producto` ya está configurada con `on delete set null`.
