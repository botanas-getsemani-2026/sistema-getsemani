# Spec: Stock Load

## User Story
Como usuario admnistrador/supervisor, quiero ver un filtro para vendedor por nombre y usuario y un filtro para fecha de carga.

## Requerimientos funcionales.

### Filtro por nombre y usuario.
- El filtro debe permitir buscar por nombre, apellido y usuario ej: get1234
  - un dropdown sería muy util
- El segundo filtro debe permitir buscar por día de carga
  - con un datepicker
- Cuando se selecciona un filtro, el sistema debe mostrar los resultados en una tabla.

### Tabla de resultados.
- El filtro devuelve un carga con sus productos
- La tabla debe mostrar los resultados de la búsqueda en formato de tabla.
- La tabla debe mostrar los campos: nombre del producto, cantidad, precio unitario, precio total
- La tabla debería tener como encabezado la fecha de carga.
- La tabla debería permitir ordenar los resultados por la propiedad `orden` del producto de forma ASC o DESC
  - `orden` es una propiedad numérica ya existente en la tabla `productos` (la misma que se usa como orden por defecto del catálogo en `/productos`)
  - Permitir que el usuario pueda elegir el orden de los resultados
  - El botón para alternar el orden vive en el encabezado de la columna "Producto" y un botón general "Ordenar ↑/↓" arriba de la tabla
  - Si un producto no tiene `orden` definido (null/undefined): se coloca al final en ASC y al inicio en DESC
- La tabla debería permitir poder quitar o añadir productos del catálogo a la carga consultada.
- La tabla debería permitir poder editar los productos en un modal con un formulario con los campos:
  - código del producto (solo de lectura)
  - nombre del producto
  - cantidad
  - precio unitario
  - precio total (cantidad * precio unitario)

### Status de la carga.
- La tabla debería mostrar el status de la carga, ej: pediente, autorizada, rechazada.
- En la UI  como resultado se debe motrar el status de la carga y el mensaje correspondiente.
  - Carga pendiente: La carga está pendiente de ser autorizada o rechazada.
  - Carga autorizada: La carga ha sido autorizada por el administrador/supervisor.
  - Carga rechazada: La carga ha sido rechazada por el administrador/supervisor.
- En la UI debería hacer 2 botones: Autorizar y Rechazar
  - Si la carga eseta pendiente, se deben de habilitaran ambos botones, si no se deshabilitan
- Debe haber un distinivo de colores para cada estado:
  - Verde: autorizada
  - Amarillo: pendiente
  - Rojo: rechazada
- Un status "rechazado" no debe poder cambiar la carga a "autorizada" o "pendiente" y se guardara el log en la tabla.
- Por el momento no se toma en cuenta el inventario, solo se cambia el status de la carga.
- Al rechazar, abrir un input para ingresar el motivo del rechazo.

### Logs y Trazabilidad.
- Los logs de la carga deben ser registrados en el sistema para poder trazarlos.
- Se debe obtener el id, nombre, usuario y fecha de quien cambió el status de la carga.
- Por ahora solo los logs del status y notificaciones

### Sistema de notificación.
- Cuando se cambia el status de la carga, se debe enviar una notificación al usuario/vendedor correspondiente.
- La notificación debe contener el nombre, id, status, mensaje correspondiente y la fecha de cambio del status.
- Se debe registrar el log correspondiente en su respectiva tabla cuando se envia la notificación.

### Guardar carga actualizada
- Al gregar un producto, este solo se debe agregar en la tabla
- Debe haber un botón en el enbezado, "Guardar carga", este actualizara la carga, metiendo los productos nuevos y los que ya estaban
- El botón solo aparecera si la carga fue modificada
  - Debe aparecer siempre que se modifico algo
  - Actualizar los detalles de la carga
  - Para saber si debe o no aparecer, crear un flag local, hasChanges, que se activará si el usuario edita/agerga/elimina un producto
- Si el usuario elimina/actualiza un producto, también lo debe eliminar/actualizar en la bd

### UI de Notificaciones.
- Las notificación sería in-app, es decir, se mostraría una notificación en la interfaz de usuario.
  - toast popup en la esquina superior derecha
  - el usuario puede cerrar la notificación manualmente
  - desaparece automáticamente después de 3 segundos
- el mesaje debe ser claro y conciso:
  - "Tu carga ha sido [status] ([mensaje] solo si fue rechazada)"

## Contexto Técnico.
- Stack: React 19, Tailwind CSS 4
- Respeta el diseño y adapta la UI a los colores y estilos definidos en el diseño.

## Contexto.
- Una carga es la cantidad de productos que lleva en el vendedor.
  - Tiene su propio id, id del vendedor, fecha de carga, status, si la carga fue cerrada y el motivo del rechazo.
- Existe otra entidad (tabla) que guarda los detalles de la carga:
  - id
  - id de la carga
  - id del producto
  - cantidad

## Contexto Técnico
- Las tablas de log aún no esta implementadas
- Estas son las tablas:

cargas:
```
create table public.cargas (
  id uuid not null,
  id_usuario uuid not null,
  fecha timestamp with time zone not null default now(),
  status text not null default 'pendiente'::text,
  id_carga_ref uuid null,
  motivo_rechazo text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint cargas_pk primary key (id),
  constraint id_usuario_fk foreign KEY (id_usuario) references perfiles (id),
  constraint cargas_status_check check (
    (
      status = any (
        array[
          'pendiente'::text,
          'autorizada'::text,
          'rechazada'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists cargas_id_usuario_idx on public.cargas using btree (id_usuario) TABLESPACE pg_default;

create index IF not exists cargas_fecha_idx on public.cargas using btree (fecha) TABLESPACE pg_default;
```

cargas_detalles:
```
create table public.cargas_detalles (
  id uuid not null,
  id_carga uuid not null,
  id_producto uuid null,
  codigo_producto text not null,
  nombre_producto text not null,
  precio_producto bigint not null,
  cantidad numeric(10, 2) not null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint cargas_detalles_pk primary key (id),
  constraint carga_id_fk foreign KEY (id_carga) references cargas (id) on delete CASCADE,
  constraint prducto_id_fk foreign KEY (id_producto) references productos (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists cd_id_carga_idx on public.cargas_detalles using btree (id_carga) TABLESPACE pg_default;

create index IF not exists cd_id_producto_idx on public.cargas_detalles using btree (id_producto) TABLESPACE pg_default;

create index IF not exists cd_codigo_producto_idx on public.cargas_detalles using btree (codigo_producto) TABLESPACE pg_default;
```
