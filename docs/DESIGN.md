# Design System

## Design Direction
Calidez doméstica, superficies de papel y terracota. La interfaz se comporta como una ayuda de cocina: primero muestra contexto, después permite actuar.

## Typography
Sans-serif del sistema, títulos de 24-28 px, nombres de ítems de 16 px y metadatos de 12-14 px. Los controles mantienen áreas mínimas de 48 px.

## Tokens
Spacing: 4/8/16/24/32/48. Background `#F8F6F1`, surface `#FFFFFF`, text `#20302B`, primary `#C9684B`, success `#DDE9DF`, warning `#F5E7B5`, danger `#F4D8D2`, border `#DDE2DC`.

## Components
| Component | Decision | Status |
|---|---|---|
| StatusChip | Siempre muestra icono + texto + color opcional | Shipped |
| ShoppingItemRow | Toda la fila es cómoda; la compra abre el paso de ubicación | Shipped |
| StoragePicker | Heladera, Freezer, Alacena y Ahora no | Shipped |
| EmptyState | Diferencia primer uso de todo al día y tiene acción siguiente | Shipped |

## UX Audit Findings
| Issue | Heuristic | Severity (0-4) | Fix | Status |
|---|---|---:|---|---|
| Tres destinos eran placeholders | Visibility of system status | 4 | Implementar Casa, Compras y Hogar | Done |
| Los faltantes del Plan no tenían acción | Match to real world | 4 | CTA “Agregar faltantes a Compras” | Done |
| Comprar no conectaba con inventario | User control and freedom | 4 | Sheet de ubicación con “Ahora no” | Done |
| Estado de inventario no tenía interacción | Affordance / execution gulf | 3 | Chip abre selector Hay/Poco/No hay | Done |
| Origen de una compra no era visible en la app | Explainability | 3 | Mostrar origen debajo de cada producto | Done |

## Microinteraction Inventory
| Interaction | Trigger/Rules/Feedback/Loops | Fix | Status |
|---|---|---|---|
| Agregar faltantes | Tap / conserva contexto / lista refleja los ítems | CTA directo desde Plan | Done |
| Marcar compra | Tap / pasa a comprado / abre ubicación | Sheet de almacenamiento | Done |
| Cambiar stock | Tap chip / una elección / estado visible | Selector cualitativo | Done |
