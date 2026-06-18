# Query: all inq_1

- Type: select

## Depends On

- [[tables/main]]
- [[tables/movment]]
- [[tables/الموظفين]]

```sql
SELECT الموظفين.*, الوظيفة.القسم, الوظيفة.الوظيفة, البنك.[اسم البنك], movment.*, [اجرة اليومية]+[DAYS]-[PROCEDURE]+[قيمة الاقتطاعات الاسبوعية] AS EMP_TOTAL_SAL
FROM main INNER JOIN (البنك INNER JOIN ((الوظيفة INNER JOIN الموظفين ON الوظيفة.[رقم القسم] = الموظفين.[رقم القسم]) INNER JOIN movment ON الموظفين.[رقم الوظيفي] = movment.[NAME NO]) ON البنك.[رقم البنك] = الموظفين.[رقم البنك]) ON main.[date no] = movment.[date no]
WHERE (((movment.[date no])=[Forms]![سلبات الرواتب]![ادخل الشهر]));

```


## Links

- [[tables/main]]
- [[tables/movment]]
- [[tables/الموظفين]]

## Referenciado por

- [[_dependencies]]
- [[reports/SALARY-V]]
