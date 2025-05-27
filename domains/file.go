package domains

type FileType string

const (
	FileTypeDirectory FileType = "Directory"
	FileTypeFile      FileType = "File"
)

type FileVisiblityType string

const (
	FileVisibilityVisible FileVisiblityType = "Visible"
	FileVisibilityHidden  FileVisiblityType = "Hidden"
)

type FileNodeDomain struct {
	ID            string            `json:"id"`
	Name          string            `json:"name"`
	Type          FileType          `json:"fileType"`
	Path          string            `json:"path"`
	Selected      bool              `json:"selected"`
	ParentId      string            `json:"parentId"`
	FileVisiblity FileVisiblityType `json:"FileVisiblity"`
	Children      []*FileNodeDomain `json:"children"`
}

type ContextsDomain []FileNodeDomain
