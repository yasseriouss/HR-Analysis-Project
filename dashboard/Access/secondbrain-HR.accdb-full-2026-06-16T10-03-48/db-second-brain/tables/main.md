# Table: main
- Type: LOCAL
- Records: 4
## Columns
| # | Name | Type | Nullable | Size |
|---:|---|---|---|---:|
| 1 | date no | Text | NO | 50 |
| 2 | date | Date/Time | YES | 8 |
| 3 | TO | Date/Time | YES | 8 |
| 4 | id | AutoNumber | YES | 4 |

## Primary Key

- date no

## Indexes

| Index | Field | Unique | Primary | Order |
|---|---|---|---|---|
| id | id | false | false | asc |
| PrimaryKey | date no | true | true | asc |

## Referenciado por FK

| FK Name | From Table | Via Column |
|---|---|---|
| mainmovment | [[tables/movment]] | date no |

## Links

- [[relationships/mainmovment]]

## Referenciado por

- [[_critical-objects]]
- [[_dependencies]]
- [[queries/all-inq_1]]
- [[relationships/mainmovment]]
- [[tables/movment]]
