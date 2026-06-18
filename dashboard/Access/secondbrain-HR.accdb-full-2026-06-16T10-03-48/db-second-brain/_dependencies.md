# Dependencies / Dependencias

## Forms → Data Source / Formularios → Fuente de datos

| Form / Formulario | RecordSource |
|---|---|
| [[forms/الدخول]] | - |
| [[forms/سلبات-الرواتب]] | - |
| [[forms/شاشة-الرواتب]] | - |
| [[forms/مستخدم]] | [[tables/بيانات]] |
| [[forms/مخازن]] | - |
| [[forms/مالى-,-ادارى]] | - |
| [[forms/الجنسية]] | "SELECT الجنسية.* FROM الجنسية; " |
| [[forms/نسخة-من-سيارات-الرئيسي]] | - |
| [[forms/موعد-انتهاء-التأمين-السيارة]] | "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.الموديل, المركبا" |
| [[forms/الديانة]] | [[tables/الديانة]] |
| [[forms/انواع-السيارات]] | [[tables/انواع-السيارات]] |
| [[forms/بيانات-الشركة]] | [[tables/بيانات-الشركة]] |
| [[forms/موعد-انتهاء-الترخيص]] | "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.اللون, المركبات." |
| [[forms/انتهاء-الترخيص]] | "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.اللون, المركبات." |
| [[forms/اختيار-السيارات]] | - |
| [[forms/شعار]] | [[tables/بيانات-الشركة]] |
| [[forms/مدير]] | - |
| [[forms/الوظيفة]] | [[tables/الوظيفة]] |
| [[forms/المركبات]] | "SELECT المركبات.* FROM المركبات WHERE (((المركبات.[نوع المركبة])=[Forms]![نسخة م" |
| [[forms/بحث-عن-الوقت]] | - |
| [[forms/الموظفين]] | - |
| [[forms/البنك]] | [[tables/البنك]] |
| [[forms/الاعدادات]] | - |
| [[forms/انواع-الاجازات]] | [[tables/انواع-الاجازات]] |
| [[forms/التأمين-السيارة]] | "SELECT المركبات.[كود المركبة], المركبات.[نوع المركبة], المركبات.الموديل, المركبا" |
| [[forms/بيان-الاجازات]] | "SELECT [بيان الاجازات].*, [انواع الاجازات].[عدد الايام المتاح للاجازة], [انواع ا" |
| [[forms/الاقساط]] | "SELECT [السلفة المالية].[الرقم الوظيفي], الاقساط.المعرف, الاقساط.[تاريخ القسط], " |
| [[forms/سلفة-المالية]] | "SELECT [السلفة المالية].*, الموظفين.الاسم, الموظفين.[الرقم الوطني], الموظفين.[رق" |
| [[forms/2]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/ص2]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/ص1]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/1]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/نسخة-من-سيارات-الرئيسي1]] | "SELECT المركبات.[كود المركبة], المركبات.[رقم اللوحة], المركبات.الباركود, المركبا" |
| [[forms/سيارات-الرئيسي1]] | "SELECT المركبات.* FROM المركبات; " |
| [[forms/الدخول1]] | - |
| [[forms/ص3]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/3]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/edit-main]] | "SELECT main.* FROM main; " |
| [[forms/ص4]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/4]] | "SELECT TOP 4 المركبات.[رقم اللوحة], المركبات.[شعار السيارة]\015\012FROM المركبات" |
| [[forms/مخالفات22]] | "SELECT المخالفات.*, المركبات.[نوع المركبة], المركبات.[صنف السيارة], المركبات.الم" |
| [[forms/اختيار-السيارات-2]] | "SELECT المركبات.* FROM المركبات WHERE (((المركبات.[رقم اللوحة])=[TempVars]![r]))" |
| [[forms/main]] | - |
| [[forms/entreusers]] | - |
| [[forms/تغير-كلمة-السر]] | - |
| [[forms/نموذج-فرعي-mov_form]] | "SELECT mov_form.[date no], mov_form.[NAME NO], mov_form.DAYS, mov_form.FACTION, " |
| [[forms/Shift]] | - |

## Queries → Used Objects / Consultas → Objetos usados

| Query / Consulta | Type / Tipo | Depends on / Depende de |
|---|---|---|
| [[queries/1]] | insert | [[tables/الاقساط]] |
| [[queries/2]] | insert | [[tables/الاقساط]] |
| [[queries/all-inq_1]] | select | [[tables/main]], [[tables/movment]], [[tables/الموظفين]] |
| [[queries/mov_form]] | select | [[tables/movment]], [[tables/الموظفين]] |
| [[queries/استعلام1]] | select | - |
| [[queries/الشهري]] | select | - |
| [[queries/المخالفات-على-العميل-1]] | select | [[tables/المخالفات]], [[tables/بيانات]] |
| [[queries/بحث-عن-مخالفات-حسب-التاريخ]] | select | [[tables/بيانات]] |
| [[queries/بحث-مخالفات-على-العميل]] | select | [[tables/المخالفات]], [[tables/بيانات]] |
| [[queries/تسجيل-الخروج]] | update | - |
| [[queries/تسجيل-الدخول]] | insert | - |
| [[queries/تغير-كلمة-السر]] | update | [[tables/المستخدمين]] |
| [[queries/تنبيه-بالمخالفات]] | select | [[tables/المخالفات]], [[tables/المركبات]] |
| [[queries/ستحقاق-القسط]] | select | [[tables/الاقساط]] |
| [[queries/سنوي]] | select | - |
| [[queries/عرض-الاقساط]] | select | [[tables/الاقساط]] |
| [[queries/مخالفات-على-المركبة]] | select | [[tables/المخالفات]], [[tables/المركبات]] |
| [[queries/موعد-انتهاء-التأمين]] | select | [[tables/المركبات]] |
| [[queries/موعد-انتهاء-الترخيص]] | select | [[tables/المركبات]] |

## Tables → Who uses them / Tablas → Quién las usa

| Table / Tabla | Queries | Forms / Formularios |
|---|---|---|
| [[tables/main]] | [[queries/all-inq_1]] | - |
| [[tables/movment]] | [[queries/all-inq_1]], [[queries/mov_form]] | - |
| [[tables/users]] | - | - |
| [[tables/الاقساط]] | [[queries/1]], [[queries/2]], [[queries/ستحقاق-القسط]], [[queries/عرض-الاقساط]] | - |
| [[tables/البنك]] | - | [[forms/البنك]] |
| [[tables/الجنسية]] | - | - |
| [[tables/الديانة]] | - | [[forms/الديانة]] |
| [[tables/السلفة-المالية]] | - | - |
| [[tables/المخالفات]] | [[queries/المخالفات-على-العميل-1]], [[queries/بحث-مخالفات-على-العميل]], [[queries/تنبيه-بالمخالفات]], [[queries/مخالفات-على-المركبة]] | - |
| [[tables/المركبات]] | [[queries/تنبيه-بالمخالفات]], [[queries/مخالفات-على-المركبة]], [[queries/موعد-انتهاء-التأمين]], [[queries/موعد-انتهاء-الترخيص]] | - |
| [[tables/المستخدمين]] | [[queries/تغير-كلمة-السر]] | - |
| [[tables/الموظفين]] | [[queries/all-inq_1]], [[queries/mov_form]] | - |
| [[tables/الوظيفة]] | - | [[forms/الوظيفة]] |
| [[tables/انواع-الاجازات]] | - | [[forms/انواع-الاجازات]] |
| [[tables/انواع-السيارات]] | - | [[forms/انواع-السيارات]] |
| [[tables/بيان-الاجازات]] | - | - |
| [[tables/بيانات]] | [[queries/المخالفات-على-العميل-1]], [[queries/بحث-عن-مخالفات-حسب-التاريخ]], [[queries/بحث-مخالفات-على-العميل]] | [[forms/مستخدم]] |
| [[tables/بيانات-الشركة]] | - | [[forms/بيانات-الشركة]], [[forms/شعار]] |
| [[tables/تسجيل-الدخول-والخروج]] | - | - |


## Links

- [[forms/1]]
- [[forms/2]]
- [[forms/3]]
- [[forms/4]]
- [[forms/Shift]]
- [[forms/edit-main]]
- [[forms/entreusers]]
- [[forms/main]]
- [[forms/اختيار-السيارات]]
- [[forms/اختيار-السيارات-2]]
- [[forms/الاعدادات]]
- [[forms/الاقساط]]
- [[forms/البنك]]
- [[forms/التأمين-السيارة]]
- [[forms/الجنسية]]
- [[forms/الدخول]]
- [[forms/الدخول1]]
- [[forms/الديانة]]
- [[forms/المركبات]]
- [[forms/الموظفين]]
- [[forms/الوظيفة]]
- [[forms/انتهاء-الترخيص]]
- [[forms/انواع-الاجازات]]
- [[forms/انواع-السيارات]]
- [[forms/بحث-عن-الوقت]]
- [[forms/بيان-الاجازات]]
- [[forms/بيانات-الشركة]]
- [[forms/تغير-كلمة-السر]]
- [[forms/سلبات-الرواتب]]
- [[forms/سلفة-المالية]]
- [[forms/سيارات-الرئيسي1]]
- [[forms/شاشة-الرواتب]]
- [[forms/شعار]]
- [[forms/ص1]]
- [[forms/ص2]]
- [[forms/ص3]]
- [[forms/ص4]]
- [[forms/مالى-,-ادارى]]
- [[forms/مخازن]]
- [[forms/مخالفات22]]
- [[forms/مدير]]
- [[forms/مستخدم]]
- [[forms/موعد-انتهاء-التأمين-السيارة]]
- [[forms/موعد-انتهاء-الترخيص]]
- [[forms/نسخة-من-سيارات-الرئيسي]]
- [[forms/نسخة-من-سيارات-الرئيسي1]]
- [[forms/نموذج-فرعي-mov_form]]
- [[queries/1]]
- [[queries/2]]
- [[queries/all-inq_1]]
- [[queries/mov_form]]
- [[queries/استعلام1]]
- [[queries/الشهري]]
- [[queries/المخالفات-على-العميل-1]]
- [[queries/بحث-عن-مخالفات-حسب-التاريخ]]
- [[queries/بحث-مخالفات-على-العميل]]
- [[queries/تسجيل-الخروج]]
- [[queries/تسجيل-الدخول]]
- [[queries/تغير-كلمة-السر]]
- [[queries/تنبيه-بالمخالفات]]
- [[queries/ستحقاق-القسط]]
- [[queries/سنوي]]
- [[queries/عرض-الاقساط]]
- [[queries/مخالفات-على-المركبة]]
- [[queries/موعد-انتهاء-التأمين]]
- [[queries/موعد-انتهاء-الترخيص]]
- [[tables/main]]
- [[tables/movment]]
- [[tables/users]]
- [[tables/الاقساط]]
- [[tables/البنك]]
- [[tables/الجنسية]]
- [[tables/الديانة]]
- [[tables/السلفة-المالية]]
- [[tables/المخالفات]]
- [[tables/المركبات]]
- [[tables/المستخدمين]]
- [[tables/الموظفين]]
- [[tables/الوظيفة]]
- [[tables/انواع-الاجازات]]
- [[tables/انواع-السيارات]]
- [[tables/بيان-الاجازات]]
- [[tables/بيانات]]
- [[tables/بيانات-الشركة]]
- [[tables/تسجيل-الدخول-والخروج]]

## Referenciado por

- [[_ai-prompt]]
- [[_critical-objects]]
- [[_entrypoints]]
- [[_guide]]
- [[_index]]
- [[_overview]]
- [[_reading-order]]
