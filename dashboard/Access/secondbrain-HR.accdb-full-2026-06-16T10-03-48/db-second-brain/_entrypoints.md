# Entrypoints / Puntos de entrada

## Startup Options / Opciones de inicio

- AppTitle: OSAMA AL HALALY
- AppIcon: C:\Users\osama\OneDrive\DATA_CASPIO SYSTEM.INMAZ2021\شعار.ico
- StartupForm: الدخول1
- StartupShowDBWindow: false
- StartupShowStatusBar: true
- StartupShortcutMenuBar: (empty)
- AllowShortcutMenus: false
- AllowFullMenus: false
- AllowBuiltInToolbars: true
- AllowToolbarChanges: true
- AllowBreakIntoCode: (empty)
- AllowSpecialKeys: false
- AllowBypassKey: (empty)
- AllowDatasheetSchema: false

## AutoExec Macros / Macros de inicio

- None

## Likely Main Forms / Formularios principales probables

- [[forms/مخالفات22]] | RecordSource: "SELECT المخالفات.*, المركبات.[نوع المركبة], المركبات.[صنف السيارة], المركبات.الم" | Controls: 41 | Procedures: 0
- [[forms/سلفة-المالية]] | RecordSource: "SELECT [السلفة المالية].*, الموظفين.الاسم, الموظفين.[الرقم الوطني], الموظفين.[رق" | Controls: 40 | Procedures: 0
- [[forms/اختيار-السيارات-2]] | RecordSource: "SELECT المركبات.* FROM المركبات WHERE (((المركبات.[رقم اللوحة])=[TempVars]![r]))" | Controls: 35 | Procedures: 0
- [[forms/المركبات]] | RecordSource: "SELECT المركبات.* FROM المركبات WHERE (((المركبات.[نوع المركبة])=[Forms]![نسخة م" | Controls: 23 | Procedures: 0
- [[forms/بيانات-الشركة]] | RecordSource: "بيانات الشركة" | Controls: 20 | Procedures: 0
- [[forms/موعد-انتهاء-التأمين-السيارة]] | RecordSource: "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.الموديل, المركبا" | Controls: 16 | Procedures: 0
- [[forms/موعد-انتهاء-الترخيص]] | RecordSource: "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.اللون, المركبات." | Controls: 16 | Procedures: 0
- [[forms/الاقساط]] | RecordSource: "SELECT [السلفة المالية].[الرقم الوظيفي], الاقساط.المعرف, الاقساط.[تاريخ القسط], " | Controls: 15 | Procedures: 0
- [[forms/التأمين-السيارة]] | RecordSource: "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.الموديل, المركبا" | Controls: 15 | Procedures: 0
- [[forms/انتهاء-الترخيص]] | RecordSource: "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.اللون, المركبات." | Controls: 14 | Procedures: 0
- [[forms/سيارات-الرئيسي1]] | RecordSource: "SELECT المركبات.* FROM المركبات; " | Controls: 14 | Procedures: 0
- [[forms/مستخدم]] | RecordSource: "بيانات" | Controls: 13 | Procedures: 0

## Likely Main Reports / Informes principales probables

- [[reports/مخالفات-حسب-الاسم22]] | Controls: 31 | Procedures: 0
- [[reports/مخالفات-حسب-الاسم-المدفوع]] | Controls: 29 | Procedures: 0
- [[reports/SALARY-V]] | Controls: 27 | Procedures: 0
- [[reports/مخالفات-حسب-السيارة22]] | Controls: 25 | Procedures: 0
- [[reports/مخالفات-على-المركبةالمدفوع-105]] | Controls: 20 | Procedures: 0
- [[reports/كرت-شاشة]] | Controls: 12 | Procedures: 0
- [[reports/استعلام1]] | Controls: 10 | Procedures: 0
- [[reports/طباعة-الباركود-3]] | Controls: 8 | Procedures: 0
- [[reports/الموظفين]] | Controls: 4 | Procedures: 0

## Suggested First Reads / Primeras lecturas sugeridas

- [[_overview]]
- [[_dependencies]]
- [[_critical-objects]]
- [[_known-issues]]
- [[_reading-order]]


## Links

- [[_critical-objects]]
- [[_dependencies]]
- [[_index]]
- [[_overview]]
- [[_reading-order]]

## Referenciado por

- [[_guide]]
- [[_index]]
- [[_overview]]
- [[_reading-order]]
