# Spec: Paginación de ventas.

## User Story
Como usuario administrador/supervisor quiero ver las ventas en una tabla paginada para poder consultarlas de forma eficiente, navegado entre páginas sin recargar la vista completa y filtrando por vendedor, por rango de fechas o por codigo de tienda.

## Requisitos funcionales.

### Consultar ventas con paginación server-side.
- Crear/actualizar el servicio de ventas (`useSalesQueries`) para que consulte las ventas en Supabase usando paginación real.
- La query debe usar `range(from, to)` y `count: 'exact'` para obtener tanto las filas de la página actual como el total.
- La paginación debe ser server-side: nunca traer todas las ventas a memoria.
- Tamaño de página por defecto: 50. Tamaño configurable: 50, 75, 100.
- La query debe estar cacheada por React Query con una `queryKey` que incluya el filtro, la página y el tamaño de página.
  - Al cambiar de página, mostrar los datos anteriores mientras llega la nueva página (sin parpadeo).
- El servicio debe respetar los filtros activos (vendedor, fechas, etc.) aplicando la condición a nivel de Supabase, no en cliente, para que el total de páginas sea consistente con la vista.

### Tabla de ventas.
- La tabla debe mostrar las ventas de la página actual, con sus columnas.
- La tabla debe mostrar los campos: fecha de la venta, vendedor, total, número de productos y el código de tienda.
- Mientras la página está cargando, mostrar el estado de carga (skeleton o texto "Cargando…").
- Si no hay ventas en la página actual, mostrar un mensaje informativo.
- Si la lista está vacía y todavía no se aplicó un filtro, mostrar un mensaje pidiendo aplicar un filtro.

### Controles de paginación.
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

### Filtros.
- El módulo de ventas ya expone dos filtros: tipo y valor.
- La paginación debe coexistir con los filtros actuales: el total reportado y la navegación deben reflejar solo las ventas que coincidan con el filtro activo.
- Al cambiar el tipo o valor del filtro, resetear a la primera página.

## Contexto Técnico.
- Stack: React 19, Tailwind CSS 4, Supabase, TanStack Query v5.
- Respeta el diseño y adapta la UI a los colores y estilos definidos en el diseño.
- Reutilizar el patrón del servicio `useLoadsQueries` de Stock Load para la estructura del hook.
- Para evitar parpadeo entre páginas, usar `placeholderData: keepPreviousData` de TanStack Query.
- La `queryKey` debe incluir siempre `[filter, page, pageSize]` para que React Query cachee cada página por separado.
- Los archivos a crear/modificar son:
  - `src/features/sales/data/sales.js` (nuevo) — hook `useSalesQueries(filter, page, pageSize)`.
  - `src/features/sales/components/SalesTable.jsx` (nuevo) — tabla + controles de paginación.
  - `src/features/sales/SalesPage.jsx` (modificar) — agregar estado de página y tamaño, y pasarlos al hook y a la tabla.
  - `src/features/sales/components/Pagination.jsx` — controles reutilizables de paginación.

## Contexto.
- Asumimos la siguiente estructura de la tabla de ventas en Supabase (a confirmar con el schema real):
  - `ventas(id, id_usuario, total, created_at, ...)`
  - El vendedor se relaciona con `perfiles(id)` a través de `id_usuario`.
  - Cada venta puede tener `ventas_detalles` con la línea por producto (similar a `cargas_detalles`).
- Si la tabla real tiene otro nombre u otros campos, ajustar las queries manteniendo la misma forma de la paginación.
- Para precios, se utiliza el método de decimales como enteros, así que en `src/utils` hay una función que ya formatea la cantidad.
- El filtro por fecha ya esta soportado, se puede ver en el if donde se valida el tipo de filtro.
- La variable activeFilter, es un objeto que recibe le tipo de filtro que se esta seleccionando, para poder entrar en el bloque correcto
  - fecha (debe ser por rango de fechas)
  - vendedor
  - tienda (id/código)

## Contexto Técnico
- Esquema de la tabla de ventas:
```
create table public.ventas (
  id uuid not null,
  registrante uuid null default auth.uid (),
  tienda_id text null,
  fecha_venta timestamp with time zone null default now(),
  total bigint null,
  created_at timestamp with time zone null,
  updated_at timestamp with time zone null default now(),
  constraint ventas_pkey primary key (id),
  constraint ventas_registrante_fkey foreign KEY (registrante) references perfiles (id),
  constraint ventas_tienda_id_fkey foreign KEY (tienda_id) references tiendas (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists ventas_tienda_idx on public.ventas using btree (tienda_id) TABLESPACE pg_default;
```

- Esquema de la tabla de ventas_detalle
```
create table public.ventas_detalle (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  venta_id uuid null,
  producto_id text null,
  cantidad numeric(10, 1) null,
  cambios integer null default 0,
  precio bigint null,
  subtotal bigint null,
  es_a_granel boolean null default false,
  constraint ventas_detalle_pkey primary key (id),
  constraint ventas_detalle_venta_id_fkey foreign KEY (venta_id) references ventas (id) on delete CASCADE
) TABLESPACE pg_default;
```
