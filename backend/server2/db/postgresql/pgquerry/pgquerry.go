package pgquerry

import (
	"database/sql"
	dbpostgresql "server2/db/postgresql/dbpostgresql"
)

var Querry *dbpostgresql.Queries

func DeclarePGQuerry(db *sql.DB) {
	Querry = dbpostgresql.New(db)
}
