# Spec: CRUD para los clientes

## User Story
Como usuario administrador quiero consultar, crear, modificar y eliminar tiendas/clientes que esten registrados

## Requisitos funcionales

### Pagina de clientes
- Nueva ruta ~/clientes, ya existe el path `src/features/clients` donde debe ir el código de la feature
- En la parte superior debe haber un bóton para poder registar un nuevo cliente
- Al entrar debe haber una tabla donde se muestres las tiendas/clientes que hay, es decir, consulta paginada
- En la tabla de clientes, de forma individual, debera tener botones para actualizar o eliminar el cliente
- El orden de la tabla debe ser por nombre de la tienda

### Filtros
- En la parte superior debe haber una barra buscadadora por codigo o por nombre del cliente
- Esta busqueda se debe disparar al peresionar un bóton de buscar
- La consulta se debe paginar si hay muchos resultados
- Se debe poder filtar por el vendedor que lo registro, consultando el catalogo de usuarios, `src/core/services`, mantener por defecto "Todos"
- El filtro deber se un estado local, que no parsista en query string

### Paginación
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

### Formularios

#### Creación de clientes
- El formulario deber ser un modal con los campos de texto:
  - requeridos: código (id), a que usuario va esa tienda (id_usuario) un select con los usuarios que hay, nombre, dueño, telefono, dirección
  - opcional: detalles (este campo es opcional),
y si es apto para credito un elemento select funciona ya que es booleano.
- Para la dirección lo ideal sería abrir un mapa de google para poder seleccionar la ubicación y así poder extraer datos extras como la latitud y la logitud
- El código del cliente se debe generar de forma aleatoria en el cliente, comprobando que no exista en la tabla, siguiendo el formato `GT-QR-XXXXX`
- Lanzar un modal de confirmación.

#### Modificación de clientes
- El formulario debe ser similar a la creación
- El único campo que no se podría editar sería el código
- Lanzar un modal de confirmación.

### Eliminación de clientes
- Lanzar un modal de confirmación, `src/components/ui/ConfirmModal`
- La eliminación es una hard delete

## Post-construcción
- Todas las consultas se deben paginar en el lado del servidor (Supabase) mediante la query no en el cliente
- La busqueda por texto es case-insensitive
- Se debe agregar un spiner de carga mientras el estado de loading sea true, y dejando placeholderData: keepPreviousData

## Contexto técnico
- Mantener el patrón feature-based
- Esta es la tabla de la bd, para las consultas y armar la tabla correctamente:
```sql
create table public.tiendas (
  id text not null,
  id_usuario uuid null default auth.uid (),
  nombre_tienda text null,
  dueno text null,
  telefono text null,
  direccion text null,
  longitud text null,
  latitud character varying null,
  detalles text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  registrante text null,
  tiene_credito boolean null default false,
  constraint Tiendas_pkey primary key (id),
  constraint tiendas_id_usuerio_fkey foreign KEY (id_usuario) references perfiles (id)
) TABLESPACE pg_default;
```
- La columna registrante recibe el email del usuario que lo registro, id_usuario