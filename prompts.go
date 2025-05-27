package main

import (
	"dnai/domains"
	"fmt"
	"os"
)

const baseSystemPrompt = `
	You are intelegent coding assistant
	the user will give you file with contents and path
	and you will help the user understand the codebases

	the user will give you files in a markdown format
`

func GetBasePrompt() domains.MessagesDomain {
	messages := make(domains.MessagesDomain, 0)
	systemMessage := &domains.MessageDomain{
		Content: baseSystemPrompt,
		Role:    domains.RoleTypeSystem,
	}
	messages = append(messages, systemMessage)

	return messages
}

func getFileMarkdownBlock(fn domains.FileNodeDomain) string {
	template := "\n```%s\n%s\n```\n"

	content, err := os.ReadFile(fn.Path)
	if err != nil {
		fmt.Println("Error reading file:", err)
		return ""
	}
	return fmt.Sprintf(template, fn.Path, content)
}

func CreateFilePromptMessage(fn domains.FileNodeDomain) *domains.MessageDomain {
	content := getFileMarkdownBlock(fn)

	return &domains.MessageDomain{
		Content: content,
		Role:    domains.RoleTypeUser,
	}
}
