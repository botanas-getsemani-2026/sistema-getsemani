# Spec: Reporte de ventas semanales.

## User Story
Como usuario administrados o supervisor, quiero consultar y generar un reporte de comisiones de los vendedores en un rango de fechas que yo elija, para poder saber cuanto es lo les corresponde a cada uno por su ventas en ese periodo.

## Requisitos funcionales

### Pagina de comisiones
- Nueva ruta ~/comisiones~ que sea accesible desde el sidebar
- Formulario con dos campos: fecha de inicio y fecha de fin
- Dos botones: "Consultar" y "Generar reporte"
- Validaciones en el cliente: fecha de fin >= fecha de inicio antes de habilitar cualquiera de los botones
- Al ingresar en la página, debe aparecer de primera los peridos creados en la tabla `periodos_comision`

### Consultar conmisiones
- En el botón de "Consultar" se llamarán a las funciones RPC de solo lectura:
  - `ventas_diarias(fecha_inicio date, fecha_fin date)`
  - `ventas_vendedor(fecha_inicio date, fecha_fin date)`
  - `ventas_diarias_vendedor(fecha_inicio date, fecha_fin date)`
  - `calcular_comision_vendedor(fecha_inicio date, fecha_fin date)`
- Que no genera un registro. Se puede llamar tantas veces el usuario cambie las fechas
- Se muestra una tabla por resultado de cada una de las funciones
- Si el rango de ventas no regresa ningun vendedor, mostrar un mensajes de que no hay ventas registradas en este rango (no es un error)

### Targetas KPI's
- En la parte superior deben estar las ventas generales (suma del periodo)
- Total del periodo
- Numeros de vendedores activos

### Tabla: "ventas por día"
- Fuente: `ventas_diarias(fecha_inicio date, fecha_fin date)`
- Columnas: fecha, total vendido y número de ventas
- Filas 'Total' al pie (suma en el cliente, no lo regresa la función)

### Tarjet/Tabla "Resumen del periodo"
- Fuente: `ventas_vendedor(fecha_inicio date, fecha_fin date)`
- Columnas: Vendedor, total vendido
- "% Participación" por vendedor: se calcula en el cliente (total_vendedor / total_general * 100), no lo regresa la función.

### Gráfica de ventas por día
- Usa el mismo resultado de `ventas_diarias`, no require una llama aparte

### Tabla "Detalles de ventas por vendedor por día"
- Fuente: `ventas_diarias_vendedor(fecha_inicio, fecha_fin)`.
- La función regresa filas (día, vendedor, total, num_ventas) — el pivote a columnas (un día por columna) se arma en el frontend, no en SQL. Ver nota técnica en Contexto.
- Fila "Total del día" y columna "Total periodo": sumas en el cliente.

### Reporte de comisiones (pantalla o sección aparte del dashboard)
- Preview: `calcular_comision_vendedor(fecha_inicio, fecha_fin)` — solo lectura, no persiste.
- Generar oficial: modal de confirmación → `generar_comisiones_periodo(fecha_inicio, fecha_fin)`.
  - Error 23P01 (traslape) → toast específico, no cierra el formulario.
  - Éxito → navegar a vista de reporte generado, usando el periodo_id (uuid) que regresa la función.
- Acciones sobre un periodo ya generado (vista de historial en `/periodos`): marcar_periodo_pagado(periodo_id), eliminar_periodo_comision(periodo_id) (bloqueada por la función si estado = 'pagado').
- 

## Pendiente (no bloquea el desarrollo inicial)
- Tarjeta y cálculo de producto excluido (plátano) — pausado hasta resolver
  la inconsistencia de `ventas_detalle` (bug de duplicación en edición de
  ventas, en investigación).

## Contexto Técnico
- Stack: React (JS), Supabase, mismo patrón feature-based del resto del
  proyecto.
- Todas las fechas se mandan a las funciones como string plano
  (`'2026-07-01'`), tal cual sale del `<input type="date">` — sin `new Date()`,
  sin `.toISOString()`. La conversión de zona horaria (`America/Mexico_City`)
  vive dentro de las funciones de Postgres, no en el frontend.
- Montos en centavos (`bigint`) en todas las funciones — dividir entre 100
  en el frontend antes de mostrar, para formatear y mostrar montos al cliente utilizar la función `src/utils/currencyUtils.js/formatCurrency()`
- Llamadas: todas por `supabase.rpc(nombre_funcion, {...})`. Ninguna de estas
  6 funciones necesita pasar por `suggest_connectors` ni MCP, son RPC directas.

  ### Funciones disponibles (ya escritas y probadas)
```
ventas_diarias(fecha_inicio date, fecha_fin date, p_vendedor_id uuid)
  returns table(dia date, total_vendido bigint, total_productos_excluidos bigint, num_ventas bigint)
 
ventas_vendedor(fecha_inicio date, fecha_fin date, p_vendedor_id uuid)
  returns table(vendedor text, total bigint, total_productos_excluidos bigint)
 
ventas_diarias_vendedor(fecha_inicio date, fecha_fin date, p_vendedor_id uuid)
  returns table(dia date, vendedor text, total bigint, total_productos_excluidos bigint, num_ventas bigint)
 
calcular_comision_vendedor(fecha_inicio date, fecha_fin date, p_vendedor_id uuid)
  returns table(vendedor text, total bigint, comision bigint)
  -- preview, no persiste
 
generar_comisiones_periodo(fecha_inicio date, fecha_fin date)
  returns uuid
  -- crea periodo + calcula comisiones, transacción única
  -- error 23P01 si el rango se traslapa con un periodo existente
 
cambiar_estado_periodo(periodo_id uuid)
  returns void
 
eliminar_periodo_comision(periodo_id uuid)
  returns void
  -- bloqueada si el periodo ya está 'pagado'
```