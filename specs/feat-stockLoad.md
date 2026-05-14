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
- La tabla debería permitir ordenar los resultados por cantidad de productos de forma ASC o DESC
  - de los productos con una mayor cantidad a los de menor cantidad, que se pieden en la carga
  - Permitir que el usuario pueda elegir el orden de los resultados
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
- Un status "rechazado" no debe poder cambiar la carga a "autorizada" o "pendiente". Se debe crear una nueva carga con el status "pendiente" y se debe registrar el log correspondiente. Se copian los productos de la carga rechazada y se asigna el status "pendiente" a la nueva carga.
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

### UI de Notificaciones.
- Las notificación sería in-app, es decir, se mostraría una notificación en la interfaz de usuario.
  - toast popup en la esquina superior derecha
  - el usuario puede cerrar la notificación manualmente
  - desaparece automáticamente después de 5 segundos
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
