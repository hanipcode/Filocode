package domains

type RoleType string

const (
	RoleTypeSystem    RoleType = "system"
	RoleTypeUser      RoleType = "user"
	RoleTypeAssistant RoleType = "assistant"
)

type MessageDomain struct {
	Content string   `json:"content"`
	Role    RoleType `json:"role"`
}

type MessagesDomain = []*MessageDomain
