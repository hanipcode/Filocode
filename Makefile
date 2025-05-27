DATABASE="sqlite3://dnai.db"
MIGRATION_PATH="./internal/sqlite/migrations"

migrate-up: $(MIGRATE) ## Apply all (or N up) migrations.
	@ read -p "How many migration you wants to perform (default value: [all]): " N; \
	migrate  -database $(DATABASE) -path=internal/sqlite/migrations up $$N

.PHONY: migrate-up-all
migrate-up-all: $(MIGRATE) ## Apply all (or N up) migrations.
	migrate  -database $(DATABASE) -path=internal/sqlite/migrations up

.PHONY: migrate-down
migrate-down: $(MIGRATE) ## Apply all (or N down) migrations.
	@ read -p "How many migration you wants to perform (default value: [all]): " N; \
	migrate  -database $(DATABASE) -path=internal/sqlite/migrations down $$N

.PHONY: migrate-drop
migrate-drop: $(MIGRATE) ## Drop everything inside the database.
	migrate  -database $(DATABASE) -path=internal/sqlite/migrations drop

.PHONY: migrate-create
migrate-create: $(MIGRATE) ## Create a set of up/down migrations with a specified name.
	@ read -p "Please provide name for the migration: " Name; \
	migrate create -ext sql -dir internal/sqlite/migrations $${Name}

