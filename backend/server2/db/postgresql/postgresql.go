package postgresql

import (
	"database/sql"
	"fmt"
	"os"
	"server2/db/postgresql/pgquerry"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

func PostgreSQLDatabaseConnect() (*sql.DB, error) {

	err := godotenv.Load()
	if err != nil {
		fmt.Println("error while fetching postgresql db config")
	}

	host := os.Getenv("POSTGRESQL_HOST")
	tempPort := os.Getenv("POSTGRESQL_PORT")
	user := os.Getenv("POSTGRESQL_USER")
	password := os.Getenv("POSTGRESQL_PASSWORD")
	dbname := os.Getenv("POSTGRESQL_DATABASE_NAME")

	port, err := strconv.Atoi(tempPort)
	if err != nil {
		fmt.Println("error while fetching postgresql db config", err)
		return &sql.DB{}, err
	}

	// Connection string
	pgsqlconnection := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", host, port, user, password, dbname)

	// Open database connection
	db, err := sql.Open("postgres", pgsqlconnection)
	if err != nil {
		CheckError(err)
		fmt.Println("error while connecting postgresql", err)
		return &sql.DB{}, err
	}

	pgquerry.DeclarePGQuerry(db)

	fmt.Println("postgresql database connected!")

	return db, nil

}
