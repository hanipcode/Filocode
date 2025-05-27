package main

import (
	"context"
	"database/sql"
	"dnai/domains"
	"dnai/internal/sqlite"
	"dnai/pkg/ai"
	"errors"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

// App struct
type App struct {
	ctx            context.Context
	fileManager    *FileManager
	contextManager *ContextManager
	db             *sql.DB
	ai             *ai.Client
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	db, err := sql.Open("sqlite3", "./dnai.db")
	if err != nil {
		panic(fmt.Errorf("Error when open sqlite connection: %w", err))
	}

	contextRepository := sqlite.NewContextRepository(db)
	a.db = db
	a.ai = ai.NewClient()
	a.ctx = ctx
	a.fileManager = NewFileManager()
	a.contextManager = NewContextManager(contextRepository)
}

func (a *App) down(ctx context.Context) bool {
	a.db.Close()
	return false
}

func (a *App) SelectDirectory(title string) error {
	path, err := a.fileManager.PromptSelectDirectory(a.ctx, title)
	if err != nil {
		return fmt.Errorf("error when selecting directory: %w", err)
	}

	if path == "" {
		return errors.New("Path cannot be empty")
	}

	fileNode, err := a.fileManager.GetFileTree(path)
	a.contextManager.InsertContext(a.ctx, fileNode)
	if err != nil {
		return fmt.Errorf("error when building filetree")
	}

	return nil
}

func (a *App) GetContexts() ([]domains.FileNodeDomain, error) {
	result, err := a.contextManager.GetContextsTree(a.ctx)
	if err != nil {
		return nil, fmt.Errorf("Error when getting contexts : %w", err)
	}

	return result, nil
}

func (a *App) Chat(message string) (string, error) {
	messages, err := a.contextManager.PrepareMessage(a.ctx)

	if err != nil {
		return "", fmt.Errorf("Error when sending chat: %w", err)
	}

	messages = append(messages, &domains.MessageDomain{
		Content: message,
		Role:    domains.RoleTypeUser,
	})

	result, err := a.ai.Chat(a.ctx, messages)

	if err != nil {
		return "", fmt.Errorf("error when sending chat 2: %w", err)
	}

	return result, nil
}
