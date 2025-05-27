package ai

import (
	"context"
	"dnai/domains"
	"fmt"
	"os"

	"github.com/openai/openai-go"
	"github.com/openai/openai-go/option"
)

type Client struct {
	_client *openai.Client
}

func NewClient() *Client {
	key, _ := os.LookupEnv("OPENROUTER_API_KEY")
	client := openai.NewClient(option.WithAPIKey(key), option.WithBaseURL("https://openrouter.ai/api/v1"))

	return &Client{
		_client: &client,
	}
}

func (c *Client) ToOpenAIMessages(domainMessages domains.MessagesDomain) []openai.ChatCompletionMessageParamUnion {
	messages := make([]openai.ChatCompletionMessageParamUnion, 0)

	for _, m := range domainMessages {
		var message openai.ChatCompletionMessageParamUnion

		if m.Role == domains.RoleTypeUser {
			message = openai.UserMessage(m.Content)
		} else {
			message = openai.SystemMessage(m.Content)
		}
		println("MESSSAGE")
		println(m.Content)

		messages = append(messages, message)
	}

	return messages
}

func (c *Client) Chat(ctx context.Context, domainMessages domains.MessagesDomain) (string, error) {
	chatCompletion, err := c._client.Chat.Completions.New(ctx, openai.ChatCompletionNewParams{
		Messages: c.ToOpenAIMessages(domainMessages),
		Model:    "google/gemini-2.0-flash-001",
	})

	if err != nil {
		return "", fmt.Errorf("Error when calling chat api: %w", err)
	}

	return chatCompletion.Choices[0].Message.Content, nil
}
