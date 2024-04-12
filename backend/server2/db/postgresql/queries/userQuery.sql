-- name: GetAuthor :one
SELECT *
FROM author
WHERE id = $1
LIMIT 1;

-- name: Listauthor :many
SELECT *
FROM author
ORDER BY name;

-- name: CreateAuthor :one
INSERT INTO author (name, bio)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateAuthor :exec
UPDATE author
set name = $2,
    bio = $3
WHERE id = $1;

-- name: DeleteAuthor :exec
DELETE FROM author
WHERE id = $1;

