import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { domains } from "../../wailsjs/go/models";
import { useColorModeValue } from "./color-mode";

type FileTreeProps = {
  nodes: domains.FileNodeDomain[];
};

export const FileTree: React.FC<FileTreeProps> = ({ nodes }) => {
  return (
    <div className="flex flex-col items-start gap-1">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </div>
  );
};

type TreeNodeProps = {
  node: domains.FileNodeDomain;
  depth: number;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.fileType === "Directory" && node.children.length > 0;

  const selectedBgLight = "blue-100";
  const selectedBgDark = "blue-700";
  const selectedColorLight = "blue-900";
  const selectedColorDark = "white";

  const selectedBg = useColorModeValue(selectedBgLight, selectedBgDark);
  const selectedColor = useColorModeValue(
    selectedColorLight,
    selectedColorDark,
  );

  const hoverBg = node.selected ? selectedBg : "gray-100";

  return (
    <div className="w-full">
      <div
        style={{
          marginLeft: `${depth * 16}px`,
        }}
        className={` ${
          hasChildren ? "cursor-pointer" : "cursor-default"
        } ${node.selected ? `bg-${selectedBg} text-${selectedColor}` : "bg-transparent"} hover:bg-${hoverBg} py-1 pr-2 rounded-md`}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        <div className={`flex items-center gap-2 `}>
          {hasChildren ? (
            <LuChevronDown
              size={16}
              className={`h-4 w-4 ${expanded ? "" : "rotate-270"}`}
            />
          ) : (
            <div className="h-4 w-4" />
          )}
          <p className="font-mono">{node.name}</p>
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="flex flex-col items-start gap-1">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
