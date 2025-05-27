package main

import (
	"context"
	"dnai/domains"
	"dnai/pkg/idgenerator"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type FileManager struct{}

func NewFileManager() *FileManager {
	return &FileManager{}
}

func (fm *FileManager) PromptSelectDirectory(ctx context.Context, title string) (string, error) {
	result, err := runtime.OpenDirectoryDialog(ctx, runtime.OpenDialogOptions{
		Title: title,
	})
	if err != nil {
		return "", fmt.Errorf("error when selecting directory: %w", err)
	}

	return result, nil
}

func (fm *FileManager) GetFileTree(rootPath string) (*domains.FileNodeDomain, error) {
	rootInfo, err := os.Stat(rootPath)
	if err != nil {
		return nil, err
	}

	return buildNode(rootPath, rootInfo)
}

func buildNode(path string, info fs.FileInfo) (*domains.FileNodeDomain, error) {
	ID := idgenerator.GenerateId("ctx")
	node := domains.FileNodeDomain{
		ID:            ID,
		Name:          info.Name(),
		FileVisiblity: domains.FileVisibilityVisible,
		Type:          domains.FileTypeFile,
		Path:          path,
	}

	if node.Name[0] == '.' {
		node.FileVisiblity = domains.FileVisibilityHidden
	}

	if info.IsDir() {
		node.Type = domains.FileTypeDirectory
		entries, err := os.ReadDir(path)
		if err != nil {
			return nil, err
		}

		for _, entry := range entries {
			childInfo, err := entry.Info()
			if err != nil {
				return nil, err
			}
			childPath := filepath.Join(path, entry.Name())
			childNode, err := buildNode(childPath, childInfo)
			if err != nil {
				return nil, err
			}
			node.Children = append(node.Children, childNode)
		}
	}

	return &node, nil
}
