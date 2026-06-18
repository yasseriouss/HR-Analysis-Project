# Query: mov_form

- Type: select

## Depends On

- [[tables/movment]]
- [[tables/الموظفين]]

```sql
SELECT movment.*, الموظفين.الاسم, الموظفين.[اجرة اليومية], ([اجرة اليومية])*([DAYS]+([ADD_HOURS]/8))-[قيمة الاقتطاعات الاسبوعية]-[PROCEDURE] AS CONT_SALARY, الموظفين.[قيمة الاقتطاعات الاسبوعية], movment.PROCEDURE
FROM الموظفين INNER JOIN movment ON الموظفين.[رقم الوظيفي] = movment.[NAME NO];

```


## Links

- [[tables/movment]]
- [[tables/الموظفين]]

## Referenciado por

- [[_dependencies]]
- [[forms/edit-main]]
