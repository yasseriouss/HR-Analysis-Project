# AI Prompt / Prompt para IA

Copia y pega este prompt en tu herramienta de IA junto con las notas relevantes de este Second Brain.

## Prompt base

```text
Analiza este Second Brain de la base Access HR.
Usa primero _overview.md, _dependencies.md, _critical-objects.md, _known-issues.md y _reading-order.md para orientarte.
Después lee solo las notas concretas relacionadas con el problema.

Objetivo:
- adquirir contexto rápido sin inventar información
- localizar el origen probable del problema
- identificar tablas, queries, forms, reports, macros y módulos implicados
- señalar riesgos, dependencias y posibles efectos secundarios
- proponer una estrategia mínima y segura para corregir o refactorizar

Reglas:
- trata como parciales los objetos listados en _known-issues.md
- no asumas comportamientos que no estén respaldados por notas o metadata
- si falta contexto, indica exactamente qué nota adicional necesitas leer
- prioriza soluciones pequeñas, locales y verificables
```

## Qué compartir con la IA según el problema

- Query rota: _dependencies.md + nota de la query + tablas relacionadas
- Form/report roto: nota del form/report + su RecordSource + módulo/macro relacionado
- Error VBA: nota del módulo + objetos enlazados desde Links
- Problema general: _overview.md + _critical-objects.md + _known-issues.md + _dependencies.md

## Suggested context pack / Pack sugerido

- [[_overview]]
- [[_dependencies]]
- [[_critical-objects]]
- [[_known-issues]]
- [[_reading-order]]


## Links

- [[_critical-objects]]
- [[_dependencies]]
- [[_guide]]
- [[_index]]
- [[_known-issues]]
- [[_overview]]
- [[_reading-order]]

## Referenciado por

- [[_guide]]
- [[_index]]
- [[_overview]]
