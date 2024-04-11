package postgresql

import (
	"database/sql"
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func CheckError(err error) {
	if err != nil {
		panic(err)
	}
}

func PostgreSQLDatabaseConnect() {

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
		return
	}

	// Connection string
	pgsqlconnection := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	// Open database connection
	db, err := sql.Open("postgres", pgsqlconnection)
	if err != nil {
		fmt.Println("error while connecting postgresql", err)
		return
	}

	CheckError(err)

	fmt.Println("postgresql database connected!")

	defer db.Close()

	err = db.Ping()
	CheckError(err)

}
