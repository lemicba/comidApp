# Roadmap de Specs - Casa

Este archivo es la guía de trabajo para implementar el MVP de Casa usando cambios pequeños y verificables.

## Flujo Para Cada Fase

1. Elegir una sola fase pendiente.
2. Ejecutar `/spec` usando el prompt de la fase.
3. Revisar propuesta, especificación, diseño y tareas generadas.
4. Ejecutar `/spec-imp` solamente para el primer lote de tareas.
5. Ejecutar lint, TypeScript y las pruebas relacionadas.
6. Marcar la fase como completada únicamente cuando sus criterios estén verificados.

No implementar una fase siguiente si la anterior todavía tiene reglas ambiguas o tareas críticas pendientes.

## Estado General

| Fase | Cambio sugerido | Estado | Dependencias |
|---|---|---|---|
| 0 | Preparar flujo SDD | Pendiente | Ninguna |
| 1 | Modelo de dominio y estado base | Pendiente | Fase 0 |
| 2 | Inventario local de Casa | Pendiente | Fase 1 |
| 3 | Plan semanal | Pendiente | Fases 1 y 2 |
| 4 | Lista de compras derivada y manual | Pendiente | Fases 2 y 3 |
| 5 | Flujo Compra -> Casa | Pendiente | Fase 4 |
| 6 | Hogar y usuario anónimo | Pendiente | Fase 1 |
| 7 | Supabase y sincronización básica | Pendiente | Fases 1 a 6 |
| 8 | Tests y validación del experimento | Pendiente | Fases 1 a 7 |

Estados válidos: `Pendiente`, `En progreso`, `Bloqueada`, `Completada`, `Diferida`.

## Fase 0 - Preparar Flujo SDD

### Objetivo

Dejar definido el contexto y la forma de dividir el MVP en cambios pequeños. No implementar funcionalidades.

### Prompt Para `/spec`

```text
Preparar el contexto Spec-Driven Development para la app Casa.

Usar como contexto:
- docs/PRODUCT.md
- docs/CREATE-APP-PLAN.md
- ../references/ai_product_context.txt
- ../references/ai_ux_ui_spec.txt

Definir una división del MVP en cambios pequeños y verificables.
No implementar funcionalidades ni modificar código de la aplicación.
```

### Criterios de finalización

- El alcance del MVP está claro.
- Las dependencias entre cambios están documentadas.
- No quedan decisiones críticas ocultas dentro de una fase demasiado grande.

## Fase 1 - Modelo De Dominio Y Estado Base

### Objetivo

Definir las entidades y reglas de negocio que conectan Plan, Casa y Compras.

### Prompt Para `/spec`

```text
Crear la spec para definir el modelo de dominio y el estado base del MVP de Casa.

Incluir:
- Household y HouseholdMember.
- FoodItem del inventario.
- Meal y PlannedMeal.
- ShoppingItem.
- Estados de inventario: hay, poco y nohay.
- Ubicaciones: Heladera, Freezer y Alacena.
- Estados de compra: pending, purchased_pending_storage y stored.
- Origen explicable de cada compra.

Revisar el estado actual de src/context/AppStateContext.tsx y src/features/plan/.
Mantener el alcance limitado al modelo y las reglas de negocio.
No implementar Supabase ni nuevas pantallas.
```

### Prompt Para `/spec-imp`

```text
Implementar únicamente las tareas de la Fase 1 relacionadas con tipos, modelo de dominio y estado base.

No implementar todavía:
- Supabase.
- Realtime.
- Nuevas pantallas.
- Onboarding.

Al finalizar ejecutar:
- npx expo lint
- npx tsc --noEmit
```

### Criterios de finalización

- Las entidades principales tienen tipos explícitos.
- Los estados importantes no dependen de strings arbitrarios.
- El origen de una compra puede representarse sin depender de texto de UI.
- La transición de compra a Casa está definida.
- El estado actual puede evolucionar sin romper las pantallas existentes.

## Fase 2 - Inventario Local De Casa

### Prompt Para `/spec`

```text
Crear la spec para implementar el inventario local de Casa.

El usuario debe poder:
- Agregar alimentos.
- Elegir ubicación y estado.
- Cambiar el estado de un alimento.
- Filtrar por Heladera, Freezer y Alacena.
- Ver empty states de primer uso, sin resultados y error.

Usar la UX definida en ai_ux_ui_spec.txt.
No implementar sincronización remota todavía.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 2 en dos lotes:

Lote 1: lógica de inventario y componentes reutilizables.
Lote 2: integración con la pantalla Casa y sus estados vacíos.

No agregar nuevas dependencias salvo que sean estrictamente necesarias.
Verificar cada lote con npx expo lint y npx tsc --noEmit.
```

### Criterios de finalización

- Se puede cargar un inventario mínimo.
- El estado se puede modificar sin perder el alimento.
- Los filtros funcionan.
- Los estados se comunican con texto e icono, no solo con color.

## Fase 3 - Plan Semanal

### Prompt Para `/spec`

```text
Crear la spec para implementar el flujo de planificación semanal de Casa.

Incluir:
- Selector de siete días.
- Cuatro slots: Desayuno, Almuerzo, Merienda y Cena.
- Crear y editar una comida.
- Asociar ingredientes o requerimientos.
- Mostrar disponibilidad y faltantes.
- Empty state con una acción clara.

Mantener el contexto al crear o editar.
No implementar todavía la generación final de Compras.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 3 en este orden:

1. Tipos y reglas de planificación.
2. Selector de días y slots.
3. Crear y editar comidas.
4. Asociación de ingredientes.

Implementar solo las tareas definidas en la spec.
No resolver todavía Supabase ni Realtime.
```

### Criterios de finalización

- Se pueden planificar entre 3 y 5 comidas.
- Una comida puede tener ingredientes.
- El usuario entiende qué ingredientes faltan.
- Cambiar una comida no destruye silenciosamente datos anteriores.

## Fase 4 - Lista De Compras

### Prompt Para `/spec`

```text
Crear la spec para implementar Compras.

La lista debe:
- Derivarse de Plan menos Casa.
- Permitir productos manuales.
- Mostrar el origen de cada producto.
- Diferenciar pendientes y comprados.
- Evitar duplicados obvios.
- Tener empty states distintos para primer uso y todo completado.

Respetar que Hay no genera compra automáticamente y que Queda poco requiere una decisión visible.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 4 en dos lotes:

Lote 1: cálculo de faltantes y reglas de deduplicación.
Lote 2: pantalla Compras, productos manuales y SourceLabel.

Cada compra derivada debe conservar una explicación verificable de su origen.
```

### Criterios de finalización

- Las compras derivadas son explicables.
- Los productos manuales se identifican correctamente.
- `Hay` no agrega faltantes automáticamente.
- `Queda poco` no se convierte silenciosamente en `No hay`.

## Fase 5 - Flujo Compra A Casa

### Prompt Para `/spec`

```text
Crear la spec para implementar la transición de una compra a Casa.

Al marcar un producto como comprado:
- Mostrar selector de ubicación.
- Permitir Heladera, Freezer, Alacena y Ahora no.
- Mantener Ahora no en Por guardar en Casa.
- Mostrar error y Reintentar si falla el guardado.
- No eliminar silenciosamente la intención del usuario.

Usar estos estados:
pending -> purchased_pending_storage -> stored
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 5 en dos lotes:

Lote 1: máquina de estados y reglas de transición.
Lote 2: selector de ubicación y sección Por guardar en Casa.

Probar explícitamente éxito, Ahora no y error de guardado.
```

### Criterios de finalización

- Una compra puede llegar al inventario.
- `Ahora no` no pierde el producto.
- Un error deja visible la intención y ofrece Reintentar.
- El flujo Plan -> Compras -> Casa funciona localmente.

## Fase 6 - Hogar Y Usuario Anónimo

### Prompt Para `/spec`

```text
Crear la spec para el onboarding de Casa.

Incluir:
- Usuario anónimo persistente por dispositivo.
- Nombre visible.
- Crear hogar.
- Unirse mediante código.
- Mostrar integrantes.
- Mostrar, copiar y compartir código de invitación.

Excluir email, contraseña, recuperación de cuenta y roles administrativos complejos.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 6 en dos lotes:

Lote 1: modelo de identidad y hogar.
Lote 2: onboarding y pantalla Hogar.

Mantener los cuatro destinos persistentes: Plan, Casa, Compras y Hogar.
```

### Criterios de finalización

- Un usuario nuevo puede crear un hogar.
- Otro usuario puede unirse usando un código.
- Plan, Casa y Compras usan el mismo hogar como contexto.

## Fase 7 - Supabase Y Sincronización Básica

### Prompt Para `/spec`

```text
Crear la spec para persistir Casa con Supabase y habilitar sincronización básica multiusuario.

Definir:
- Tablas y relaciones.
- Operaciones de lectura y escritura.
- Suscripciones Realtime.
- Estados de carga.
- Errores de conexión.
- Reintentos.

Excluir offline real, cola de mutaciones, replay y resolución avanzada de conflictos.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 7 en estos lotes:

Lote 1: configuración, schema y tipos remotos.
Lote 2: repositorios de lectura y escritura.
Lote 3: Realtime, errores y Reintentar.

Antes de usar APIs de Expo, React Native o Supabase, consultar la documentación de las versiones instaladas.
No implementar offline real.
```

### Criterios de finalización

- Dos usuarios pueden observar cambios compartidos.
- Los errores de lectura y escritura son visibles.
- Existe una acción Reintentar.
- La app no promete sincronización offline que no implementa.

## Fase 8 - Tests Y Validacion

### Prompt Para `/spec`

```text
Crear la spec de calidad para validar el MVP de Casa contra EXP-001.

Cubrir:
- Reglas de inventario.
- Cálculo de faltantes.
- Origen de compras.
- Transición compra a Casa.
- Errores de conexión y reintentos.
- Estados vacíos y de carga.
- Accesibilidad básica.

Definir criterios verificables para lint, TypeScript, tests y validación manual en Android e iOS.
```

### Prompt Para `/spec-imp`

```text
Implementar la Fase 8 en este orden:

1. Tests de reglas de negocio.
2. Tests del flujo Plan -> Compras -> Casa.
3. Tests de errores y reintentos.
4. Accesibilidad y estados de carga.
5. Validación final del MVP.

Ejecutar como mínimo:
- npx expo lint
- npx tsc --noEmit
```

### Criterios de finalización

- Las reglas críticas tienen tests.
- El flujo principal puede repetirse sin intervención manual.
- Lint y TypeScript pasan.
- La app está lista para la prueba de siete días con hasta tres hogares.

## Registro De Cada Cambio

Completar esta sección después de cada `/spec-imp`.

### Cambio

- Nombre:
- Fecha:
- Fase:
- Tareas implementadas:
- Tareas pendientes:

### Verificación

- `npx expo lint`: Pendiente / OK / Falló
- `npx tsc --noEmit`: Pendiente / OK / Falló
- Tests relacionados: Pendiente / OK / Falló
- Validación manual: Pendiente / OK / Falló

### Decisiones O Desvíos

-

### Próximo Lote

-
