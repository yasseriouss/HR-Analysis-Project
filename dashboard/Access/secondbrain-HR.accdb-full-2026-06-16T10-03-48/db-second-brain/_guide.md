# Second Brain — Guide / Guía de uso

> Auto-generated from / Generado desde: **HR**  
> Date / Fecha: 2026-06-16T10:03:48.770Z

---

## 🇬🇧 English

### What is this vault?

This Obsidian vault contains a complete map of an Access database:
tables, queries, forms, reports, VBA modules, relationships and dependencies.
Each object is a note with its metadata, outgoing links and automatic backlinks.

### How to open in Obsidian

1. Open Obsidian → **Open folder as vault**
2. Select the root folder of this export
3. Trust the vault when prompted
4. Start from [[_index]] or use **Graph View** to navigate dependencies visually

#### Key notes

| Note | Description |
|---|---|
| [[_index]] | Entry point with general statistics |
| [[_overview]] | Summary, MOCs and VBA references |
| [[_entrypoints]] | Likely entry forms, reports, startup options and AutoExec macros |
| [[_critical-objects]] | Objects with highest diagnostic and refactor priority |
| [[_health]] | Quality checks: forms without source, orphan tables… |
| [[_known-issues]] | Timeouts, partial objects and warnings grouped for review |
| [[_dependencies]] | Cross-reference map: forms→tables, queries→tables |
| [[_reading-order]] | Recommended reading sequence by problem type |
| [[_ai-prompt]] | Ready-to-copy prompt and context pack for AI analysis |

#### Folder structure

| Folder | Contents |
|---|---|
| `tables/` | One note per table with columns, PKs, FKs and indexes |
| `queries/` | One note per query with SQL and dependencies |
| `forms/` | One note per form with controls, properties and VBA code |
| `reports/` | One note per report with controls and VBA code |
| `modules/` | One note per module with procedure index and code |
| `macros/` | One note per macro with its actions |
| `relationships/` | One note per table relationship |
| `linked-tables/` | Linked tables with their ODBC or MDB origin |
| `mocs/` | Knowledge maps grouped by domain (high density mode) |
| `startup/` | Application startup options |

### How to use with AI (Claude, ChatGPT, Copilot…)

**Option A — Paste content directly**

1. Open the relevant note (e.g. `tables/MyTable.md`)
2. Copy its full content
3. Paste it into your AI conversation with your question

**Option B — Upload the full vault as context**

If your AI tool supports file/folder uploads:

1. Compress the `db-second-brain/` folder into a ZIP
2. Upload it as context to the session
3. Ask for full analysis: *"Which forms use table X?"*,
   *"Explain the data flow of this module"*, *"Are there orphan tables?"*

**Example prompts**

```
Analyze this Access database Second Brain.
Identify critical dependencies and potential design issues.
```

```
Based on _dependencies.md, which tables are most critical?
What would happen if I delete table X?
```

```
Read module Y and explain what each procedure does.
Generate English documentation for each function.
```

```
Review _health.md and suggest fixes for each issue found.
```

### Obsidian tips

- Use **Ctrl+G** to open Graph View and navigate visually
- Use **Ctrl+P** → *Switcher* to search any note by name
- Filter the graph by folder (e.g. only `tables/`) to see a sub-graph
- Install the **Dataview** plugin to run SQL-like queries over notes
- With Dataview you can list all forms that use a specific table

---

## 🇪🇸 Español

### ¿Qué es este vault?

Este vault Obsidian contiene un mapa completo de la base de datos Access:
tablas, consultas, formularios, informes, módulos VBA, relaciones y dependencias.
Cada objeto es una nota con sus metadatos, vínculos y backlinks automáticos.

### Cómo abrirlo en Obsidian

1. Abre Obsidian → **Abrir carpeta como vault**
2. Selecciona la carpeta raíz de este export
3. Confía en el vault cuando lo pida
4. Empieza desde [[_index]] o usa **Graph View** para ver el grafo de dependencias

#### Notas clave

| Nota | Descripción |
|---|---|
| [[_index]] | Punto de entrada con estadísticas generales |
| [[_overview]] | Resumen, MOCs y referencias VBA |
| [[_entrypoints]] | Formularios, informes y macros de inicio más probables |
| [[_critical-objects]] | Objetos con mayor prioridad diagnóstica y de refactor |
| [[_health]] | Checks de calidad: formularios sin fuente, tablas huérfanas… |
| [[_known-issues]] | Timeouts, objetos parciales y advertencias agrupadas |
| [[_dependencies]] | Mapa cruzado: formularios→tablas, consultas→tablas |
| [[_reading-order]] | Orden recomendado de lectura según el problema |
| [[_ai-prompt]] | Prompt listo para usar con IA y pack de contexto |

#### Estructura de carpetas

| Carpeta | Contenido |
|---|---|
| `tables/` | Una nota por tabla con columnas, PKs, FKs e índices |
| `queries/` | Una nota por consulta con SQL y dependencias |
| `forms/` | Una nota por formulario con controles, props y código VBA |
| `reports/` | Una nota por informe con controles y código VBA |
| `modules/` | Una nota por módulo con índice de procedimientos y código |
| `macros/` | Una nota por macro con sus acciones |
| `relationships/` | Una nota por relación entre tablas |
| `linked-tables/` | Tablas vinculadas con su origen ODBC o MDB |
| `mocs/` | Mapas de conocimiento agrupados por dominio (high density) |
| `startup/` | Opciones de inicio de la aplicación |

### Cómo usarlo con IA (Claude, ChatGPT, Copilot…)

**Opción A — Pegar el contenido directamente**

1. Abre la nota relevante (por ejemplo `tables/MiTabla.md`)
2. Copia su contenido completo
3. Pégalo en tu conversación con la IA junto con tu pregunta

**Opción B — Exportar el vault completo como contexto**

Si tu herramienta de IA soporta subida de archivos o carpetas:

1. Comprime la carpeta `db-second-brain/` en un ZIP
2. Súbelo como contexto a la sesión
3. Pide análisis completos: *"¿Qué formularios usan la tabla X?"*,
   *"Explica el flujo de datos de este módulo"*, *"¿Hay tablas sin relaciones?"*

**Prompts de ejemplo**

```
Analiza el siguiente Second Brain de una base de datos Access.
Identifica las dependencias críticas y posibles problemas de diseño.
```

```
Basándote en la nota _dependencies.md, ¿qué tablas son más críticas?
¿Qué pasaría si elimino la tabla X?
```

```
Lee el módulo Y y explica qué hace cada procedimiento.
Genera documentación en español para cada función.
```

```
Revisa _health.md y propón soluciones para cada issue encontrado.
```

### Tips para Obsidian

- Usa **Ctrl+G** para abrir el Graph View y navegar visualmente
- Usa **Ctrl+P** → *Switcher* para buscar cualquier nota por nombre
- Filtra el grafo por carpeta (p.ej. solo `tables/`) para ver un sub-grafo
- Instala el plugin **Dataview** para hacer queries SQL sobre las notas
- Con Dataview puedes listar todos los formularios que usan una tabla


## Links

- [[_ai-prompt]]
- [[_critical-objects]]
- [[_dependencies]]
- [[_entrypoints]]
- [[_health]]
- [[_index]]
- [[_known-issues]]
- [[_overview]]
- [[_reading-order]]

## Referenciado por

- [[_ai-prompt]]
- [[_index]]
- [[_overview]]
