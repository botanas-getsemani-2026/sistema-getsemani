# Spec: Modulo de vendedores (CRUD)

## User Story
Como usuario quiero gestionar los vendedores del sistema: crear, actualizar y editar los vendedores existentes. Además de ver de primera una tabla con los usuario en mi sistema.

## Requisitos funcionales.

### Página del catálogo.
- Nueva ruta `/vendedores` accesible desde el sidebar
- La página muestra una tabla con todos los vendedores ordenados por nombre
- Columnas de la tabla: nombre completo (nombre + papellido + sapellido), email, rol, estado, acciones
- Filtros aplicados en el servidor (Supabase):
  - "Buscar por nombre": input que filtra por `nombre`, `papellido` o `sapellido` (case-insensitive con `ilike` y `OR`)
  - "Buscar por email": input que filtra por `email` (case-insensitive con `ilike`)
  - Select de estado: `todos`, `activo`, `inactivo`
- Al cambiar cualquier filtro o el tamaño de página se resetea a la página 1
- Botón "Nuevo usuario" en el encabezado
- Estados coloreados: `activo` → verde (`bg-green-600`), `inactivo` → rojo (`bg-red-600`)
- Roles mostrados como badge con fondo `surface-variant`
- Sin columna de acciones de toggle/eliminar; solo el botón `Pencil` para editar

### Crear usuario (vendedor)
- Modal con formulario con los siguientes campos:
  - `nombre` (requerido)
  - `papellido` (requerido)
  - `sapellido` (opcional)
  - `usuario` (input + botón regenerar): el sistema genera automáticamente una parte local con formato `get[4 dígitos aleatorios]`. El admin solo ve y captura esta parte local, nunca el `@getsemani.com`. Se muestra un preview del email completo (`getXXXX@getsemani.com`) como texto informativo.
  - `password` (input type=password, requerido, mínimo 8 caracteres)
  - `rol` (select con valores: `admin`, `vendedor`, `supervisor`, `desarrollador`; default `vendedor`)
  - `estado`: no se muestra en el form, se inicializa automáticamente a `activo`
- Validaciones en cliente:
  - nombre requerido
  - primer apellido requerido
  - usuario requerido con formato `get\d{4}`
  - password mínimo 8 caracteres
- Al hacer submit se lanza el `ConfirmModal` con título "Crear vendedor" y contenido "¿Crear el vendedor X con usuario Y?". Si se confirma se invoca la Edge Function `create-vendor`.
- La Edge Function `create-vendor`:
  - Verifica que el caller esté autenticado (JWT válido)
  - Verifica que el `perfiles.rol` del caller sea `admin` (retorna HTTP 403 si no)
  - Valida que el `username` recibido tenga formato `get\d{4}`
  - Verifica si el email generado (`${username}@getsemani.com`) ya existe en `auth.users`. Si existe, regenera los 4 dígitos y vuelve a verificar (máximo 10 intentos). Si supera el máximo, retorna HTTP 409 con mensaje "No se pudo generar un usuario único".
  - Crea el usuario en `auth.users` con `email_confirm: true` (sin magic link)
  - Inserta en `public.perfiles` con `{ id, email, nombre, papellido, sapellido, rol, estado }`
  - Si el INSERT en `perfiles` falla, hace **rollback** eliminando el `auth.users` recién creado
- Toast de éxito: `Vendedor "X" creado correctamente.`

### Editar usuario
- Botón de "Editar" en cada fila de la tabla
- Modal con formulario precargado con los siguientes campos:
  - `nombre` (requerido)
  - `papellido` (requerido)
  - `sapellido` (opcional)
  - `rol` (select editable con valores: `admin`, `vendedor`, `supervisor`, `desarrollador`)
  - `estado` (select editable con valores `activo`, `inactivo`)
  - `email`: se muestra como texto informativo derivado del email actual, no es editable
  - `password`: no se muestra; gestión de reset fuera de alcance
- Validaciones: no dejar ningún campo vacío a excepción del segundo apellido
- Al guardar, llamar a `UPDATE` en `perfiles` filtrando por `id`
- Al hacer submit se lanza el `ConfirmModal` con título "Guardar cambios" y contenido "¿Guardar los cambios del vendedor X?". Si se confirma se ejecuta la mutación.
- Toast de éxito: `Vendedor "X" actualizado correctamente.`
- El cambio de `estado` a `inactivo` desde este form actúa como soft-delete (no existe operación de DELETE separada ni botón toggle en las filas).

### Visualizar los usuarios
- Al ingresar en `/vendedores` se debe visualizar una tabla con los registros de los usuarios.

### Estados del usuario
- En la creación el estado se inicializa a `activo` por defecto (no se muestra en el form)
- En la edición el estado se muestra como `select` editable con valores `activo` o `inactivo`
- Los usuarios tienen 2 estados:
  - activo
  - inactivo
- Crear archivo en `src/constants/vendors.js` con las constantes exportadas:
```javascript
export const VENDOR_STATUS = {
  ACTIVE: 'activo',
  INACTIVE: 'inactivo'
}
```

### Roles del usuario
- Los usuarios tienen un rol que se selecciona tanto en el form de creación como en el de edición.
- Valores válidos: `admin`, `vendedor`, `supervisor`, `desarrollador`.
- Valor por defecto al crear: `vendedor`.
- La restricción la impone el check constraint `perfiles_rol_check` ya presente en la tabla.

### Paginación
- En el pie de la tabla se deben mostrar los controles de paginación:
  - Selector de tamaño de página (50 / 75 / 100).
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
- Se reutiliza el componente `<Pagination>` de `src/features/sales/components/Pagination.jsx`.

## Aclaraciones técnicas (post-construcción)
- Los filtros se deben aplicar **en el servidor** (Supabase) mediante la query, no en el cliente. El total de la paginación refleja la cantidad de filas **después de aplicar los filtros**.
- La búsqueda por texto es case-insensitive usando `ilike` de Postgres.
- El estado de loading durante el cambio de página usa `placeholderData: keepPreviousData` de TanStack Query para mantener visible la página anterior mientras llega la nueva.
- `staleTime: Infinity` se descarta, se utiliza `placeholderData` en su lugar.
- Se puede crear un nuevo hook `useUsersPaginated`, para las consultas paginadas en el archivo `src/core/services/users.js`.
- Las mutaciones `useCreateVendorMutation` y `useUpdateVendorMutation` viven en `src/features/vendors/data/mutations.js`.
- `useCreateVendorMutation` invoca la Edge Function `create-vendor` con `client.functions.invoke`.
- `useUpdateVendorMutation` hace `UPDATE` sobre `perfiles` filtrando por `id`.
- Tras éxito de cualquier mutación se invalidan las queries `['vendors']`, `['users']` y `['currentUser']` (esta última para reflejar cambios de rol).
- `queryKey` de TanStack Query:
  - `useUsersPaginated`: `['vendors', 'paginated', filters, page, pageSize]`

## Contexto Técnico
- Stack: React 19, Tailwind CSS 4, Supabase, TanStack Query, React Router 7.
- Mantener el patrón feature-based usado en `products`
- Reutilizar `ConfirmModal` y `useToast`
- Para crear el usuario es necesario crear una edge function en supabase, utilizando supabase cli

```sql
create table public.perfiles (
  id uuid not null,
  email text not null,
  papellido text null default ''::text,
  sapellido text null default ''::text,
  rol text null,
  nombre text null,
  estado text not null default 'activo'::text,
  constraint perfiles_pkey primary key (id),
  constraint perfiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint estado_perfilchk check (
    (
      estado = any (array['activo'::text, 'inactivo'::text])
    )
  ),
  constraint perfiles_rol_check check (
    (
      rol = any (
        array[
          'vendedor'::text,
          'supervisor'::text,
          'desarrollador'::text,
          'admin'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists perfiles_nombre_papellido_idx on public.perfiles using btree (nombre, papellido) TABLESPACE pg_default;

create index IF not exists perfiles_nombre_idx on public.perfiles using btree (nombre) TABLESPACE pg_default;

create trigger update_sync_rol
after INSERT
or
update OF rol,
nombre,
papellido,
sapellido on perfiles for EACH row
execute FUNCTION sync_rol_a_metadata ();
```