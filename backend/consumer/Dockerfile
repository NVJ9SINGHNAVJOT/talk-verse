FROM golang:1.22-alpine AS builder
WORKDIR /app

# pre-copy/cache go.mod for pre-downloading dependencies and only redownloading them in subsequent builds if they change
COPY go.mod go.sum ./
RUN go mod download && go mod verify

COPY . .
RUN go build -o ./dist/main main.go

FROM builder AS runner
WORKDIR /app

COPY --from=builder /app/dist .

ENTRYPOINT [ "/app/main" ]