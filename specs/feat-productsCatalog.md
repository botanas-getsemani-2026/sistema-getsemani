# Spec: Añadir el catálogo de productos.

## User Story
Como usuario quiero ver o consultar el catalog de productos a la hora de editar o agregar un producto en la carga.

## Requisitos funcionales

### Crear los servicios para los productos
- Crear las queries para consultar el catalogo de productos productos
  - La query debe pedir todos los productos y guardarlos en cache, prueba utilizando React Query

### Implementar filtro del producto en Cargas
- Implementar el filtro por nombre del producto en el modal para agregar un producto a la carga.
- Si el producto no existe informar al usuario, con un texto debajo del input
  - El texto debe decir "El producto no existe"
  - El botón debería seguir bloqueado si es que no existe
  - No se debe distinguir entre mayusculas y minisculas ej: HOY = hoy
  - El flag es_a_granel ayuda a distinguir si el producto se puede vender a grane
- Implementar un sub-filtro para filtrar por tipo de producto, con un elemento select HTML
  - a granel
  - por pieza

## Contexto Técnico.
- Stack: React 19, Tailwind CSS 4, Supabase
- Respeta el diseño y adapta la UI a los colores y estilos definidos en el diseño.
- Diseño del tabla en Supabase:
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
