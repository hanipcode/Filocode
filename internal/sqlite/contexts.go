package sqlite

import (
	"context"
	"database/sql"
)

// ContextEntry represents a row in the "contexts" table.
type ContextEntry struct {
	ID       string
	Type     string
	Path     string
	ParentID string // optional
	Selected bool   // optional (you can change to bool with INT if you prefer)
}

// ContextRepository handles DB operations for "contexts" table.
type ContextRepository struct {
	db *sql.DB
}

// NewContextRepository creates a new repo with the given DB connection.
func NewContextRepository(db *sql.DB) *ContextRepository {
	return &ContextRepository{db: db}
}

// Insert adds a new context entry.
func (r *ContextRepository) Insert(ctx context.Context, entry ContextEntry) error {
	query := `INSERT INTO contexts (id, type, path, parentId, selected) VALUES (?, ?, ?, ?, ?)`
	_, err := r.db.ExecContext(ctx, query, entry.ID, entry.Type, entry.Path, entry.ParentID, entry.Selected)
	return err
}

// GetByID fetches one context entry by ID.
func (r *ContextRepository) GetByID(ctx context.Context, id string) (*ContextEntry, error) {
	query := `SELECT id, type, path, parentId, selected FROM contexts WHERE id = ?`

	row := r.db.QueryRowContext(ctx, query, id)

	var entry ContextEntry
	if err := row.Scan(&entry.ID, &entry.Type, &entry.Path, &entry.ParentID, &entry.Selected); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil // not found
		}
		return nil, err
	}
	return &entry, nil
}

// ListAll returns all context entries.
func (r *ContextRepository) ListAll(ctx context.Context) ([]ContextEntry, error) {
	query := `SELECT id, type, path, parentId, selected FROM contexts`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []ContextEntry
	for rows.Next() {
		var entry ContextEntry
		if err := rows.Scan(&entry.ID, &entry.Type, &entry.Path, &entry.ParentID, &entry.Selected); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}
	return results, nil
}

// ListAll returns all parent entries.
func (r *ContextRepository) ListAllParent(ctx context.Context) ([]ContextEntry, error) {
	query := `SELECT id, type, path, parentId, selected FROM contexts where parentId = null`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []ContextEntry
	for rows.Next() {
		var entry ContextEntry
		if err := rows.Scan(&entry.ID, &entry.Type, &entry.Path, &entry.ParentID, &entry.Selected); err != nil {
			return nil, err
		}
		results = append(results, entry)
	}
	return results, nil
}

// DeleteByID deletes a context by its ID.
func (r *ContextRepository) DeleteByID(ctx context.Context, id string) error {
	_, err := r.db.ExecContext(ctx, `DELETE FROM contexts WHERE id = ?`, id)
	return err
}
