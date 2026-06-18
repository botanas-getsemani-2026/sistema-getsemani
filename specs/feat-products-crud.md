# Spec: Módulo de productos (CRUD)

## User Story
Como usuario quiero gestionar el catálogo de productos: crear nuevos productos, editar
los existentes y eliminar los que ya no se ofrecen.

## Requisitos funcionales

### Página de catálogo
- Nueva ruta `/productos` accesible desde el Sidebar.
- La página muestra una tabla con todos los productos ordenados por nombre.
- Columnas: código, nombre, precio, granel (Sí/No), acciones (editar, eliminar).
- Filtro por nombre (case-insensitive) y filtro por tipo (todos / granel / pieza).
- Botón "Nuevo producto" en el encabezado.

### Crear producto
- Modal con formulario: código, nombre, precio, granel.
- Validaciones en cliente:
  - código requerido y único (chequear contra la lista cargada).
  - nombre requerido.
  - precio > 0.
- Al guardar, llamar a `INSERT` en `productos` e invalidar la query `['products']`.

### Editar producto
- Botón "Editar" en cada fila.
- Mismo modal en modo edición, con los campos precargados.
- Al guardar, llamar a `UPDATE` en `productos` filtrando por `id`.
- Invalidar la query `['products']`.

### Eliminar producto
- Botón "Eliminar" en cada fila.
- Antes de eliminar, contar cuántas cargas referencian al producto
  (`cargas_detalles.id_producto = id`).
- Si el conteo > 0, mostrar advertencia explicando que las cargas históricas
  conservarán sus datos guardados (código, nombre, precio, cantidad) pero perderán
  la referencia viva al producto (FK `on delete set null`).
- Confirmar y ejecutar `DELETE` en `productos`.
- Invalidar la query `['products']`.

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
  constraint productos_pkey primary key (id),
  constraint productos_codigo_key unique (codigo)
) TABLESPACE pg_default;
```
- La columna `logo_res` puede recibir un string vacío en este pase (subida de
  imagen queda para una spec futura).
- FK desde `cargas_detalles.id_producto` ya está configurada con `on delete set null`.
