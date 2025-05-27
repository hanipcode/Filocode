package main

import (
	"context"
	"dnai/domains"
	"dnai/internal/sqlite"
	"fmt"
	"path/filepath"
)

type ContextManager struct {
	contextRepository *sqlite.ContextRepository
}

func NewContextManager(contextRepository *sqlite.ContextRepository) *ContextManager {
	return &ContextManager{
		contextRepository: contextRepository,
	}
}

func (cm *ContextManager) InsertContext(ctx context.Context, fn *domains.FileNodeDomain) error {
	return cm.insertRecursive(ctx, fn, "")
}

func (cm *ContextManager) GetContextsTree(ctx context.Context) ([]domains.FileNodeDomain, error) {
	entries, err := cm.contextRepository.ListAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("error when get context: %w", err)
	}

	return cm.buildFileNodeTree(entries), nil

}

func (cm *ContextManager) GetContextList(ctx context.Context) ([]domains.FileNodeDomain, error) {
	entries, err := cm.contextRepository.ListAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("error when get context: %w", err)
	}

	nodes := make([]domains.FileNodeDomain, 0)

	for _, e := range entries {
		nodes = append(nodes, *toFileNodeDomain(e))
	}

	return nodes, nil
}

func (cm *ContextManager) PrepareMessage(ctx context.Context) (domains.MessagesDomain, error) {
	messages := GetBasePrompt()
	entries, err := cm.GetContextList(ctx)
	if err != nil {
		return nil, fmt.Errorf("error when get context: %w", err)
	}

	for _, e := range entries {
		println("HERE")
		println(e.Name)
		if e.FileVisiblity == domains.FileVisibilityHidden {
			continue
		}
		if e.Type == domains.FileTypeFile {
			fileMessage := CreateFilePromptMessage(e)
			messages = append(messages, fileMessage)
		}
	}

	return messages, nil
}

func toFileNodeDomain(e sqlite.ContextEntry) *domains.FileNodeDomain {
	return &domains.FileNodeDomain{
		ID:            e.ID,
		Name:          filepath.Base(e.Path),
		Type:          domains.FileType(e.Type),
		Path:          e.Path,
		ParentId:      e.ParentID,
		Selected:      e.Selected,
		FileVisiblity: domains.FileVisibilityVisible,
		Children:      make([]*domains.FileNodeDomain, 0),
	}
}

func (cm *ContextManager) buildFileNodeTree(entries []sqlite.ContextEntry) []domains.FileNodeDomain {
	// Step 1: Convert flat data to map[id]node
	nodes := make(map[string]*domains.FileNodeDomain)
	var roots []*domains.FileNodeDomain
	var result []domains.FileNodeDomain

	for _, e := range entries {
		node := toFileNodeDomain(e)
		if node.Name[0] == '.' {
			node.FileVisiblity = domains.FileVisibilityHidden
		}
		nodes[e.ID] = node
	}

	// attach every node to its parent
	for _, n := range nodes {

		if n.ParentId == "" {
			// root node
			roots = append(roots, n)
		} else {
			if n.FileVisiblity == domains.FileVisibilityVisible {
				parentNode := nodes[n.ParentId]
				parentNode.Children = append(parentNode.Children, n)
			}
		}
	}

	// last step loop pointer
	for _, ptr := range roots {
		if ptr != nil {
			result = append(result, *ptr)
		}
	}

	return result
}

func (cm *ContextManager) insertRecursive(ctx context.Context, fn *domains.FileNodeDomain, parentId string) error {
	entry := sqlite.ContextEntry{
		ID:       fn.ID,
		Type:     string(fn.Type),
		Path:     fn.Path,
		ParentID: parentId,
		Selected: fn.Selected,
	}

	if err := cm.contextRepository.Insert(ctx, entry); err != nil {
		return fmt.Errorf("insert failed for ID %s: %w", fn.ID, err)
	}

	for _, child := range fn.Children {
		if err := cm.insertRecursive(ctx, child, fn.ID); err != nil {
			return err
		}
	}

	return nil
}
