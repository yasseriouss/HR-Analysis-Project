# Reading Order / Orden de lectura

## UI bug / Problema de interfaz

1. [[_entrypoints]]
2. Nota del formulario o informe afectado
3. Su RecordSource en [[_dependencies]] o en la nota de query/tabla
4. El módulo o macro relacionado

## Data bug / Problema de datos

1. [[_dependencies]]
2. Nota de la tabla afectada
3. Queries que leen o escriben esa tabla
4. Forms/reports que usan esas queries

## VBA bug / Problema en VBA

1. [[_critical-objects]]
2. Nota del módulo o code-behind
3. Objetos enlazados desde la sección Links
4. [[_known-issues]] para ver si hay extracción parcial

## Performance issue / Problema de rendimiento

1. [[_known-issues]]
2. [[_critical-objects]]
3. Queries con SQL ausente o timeouts
4. Forms/reports con muchos controles o incidencias


## Links

- [[_critical-objects]]
- [[_dependencies]]
- [[_entrypoints]]
- [[_index]]
- [[_known-issues]]
- [[_overview]]

## Referenciado por

- [[_ai-prompt]]
- [[_entrypoints]]
- [[_guide]]
- [[_index]]
- [[_overview]]
