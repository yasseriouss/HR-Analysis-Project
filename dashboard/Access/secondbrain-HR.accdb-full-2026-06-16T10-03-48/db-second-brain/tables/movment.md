# Table: movment
- Type: LOCAL
- Records: 13
## Columns
| # | Name | Type | Nullable | Size |
|---:|---|---|---|---:|
| 1 | date no | Text | YES | 50 |
| 2 | NAME NO | Long | YES | 4 |
| 3 | DAYS | Single | YES | 4 |
| 4 | FACTION | Single | YES | 4 |
| 5 | ADD_HOURS | Single | YES | 4 |
| 6 | AQ_ASS | Single | YES | 4 |
| 7 | AMM_ASS | Single | YES | 4 |
| 8 | PROCEDURE | Single | YES | 4 |
| 9 | takafol | Single | YES | 4 |
| 10 | aytam | Long | YES | 4 |

## Primary Key

- None

## Indexes

| Index | Field | Unique | Primary | Order |
|---|---|---|---|---|
| movmentdate no | date no | false | false | asc |
| movmentNAME NO | NAME NO | false | false | asc |

## Foreign Keys

| FK Name | Column | Ref Table | Ref Column |
|---|---|---|---|
| mainmovment | date no | [[tables/main]] | date no |
| الموظفينmovment | NAME NO | [[tables/الموظفين]] | رقم الوظيفي |

## Links

- [[relationships/mainmovment]]
- [[relationships/الموظفينmovment]]
- [[tables/main]]
- [[tables/الموظفين]]

## Referenciado por

- [[_critical-objects]]
- [[_dependencies]]
- [[queries/all-inq_1]]
- [[queries/mov_form]]
- [[relationships/mainmovment]]
- [[relationships/الموظفينmovment]]
