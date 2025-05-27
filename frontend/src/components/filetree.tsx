import React, { useState } from "react";
import { Box, Text, Icon, VStack } from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";
import { LuChevronDown, LuChevronRight } from "react-icons/lu";
import { domains } from "../../wailsjs/go/models";

type FileTreeProps = {
  nodes: domains.FileNodeDomain[];
};

export const FileTree: React.FC<FileTreeProps> = ({ nodes }) => {
  return (
    <VStack align="start" gap={1}>
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} depth={0} />
      ))}
    </VStack>
  );
};

type TreeNodeProps = {
  node: domains.FileNodeDomain;
  depth: number;
};

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.fileType === "Directory" && node.children.length > 0;

  const selectedBg = useColorModeValue("blue.100", "blue.700");
  const selectedColor = useColorModeValue("blue.900", "white");

  return (
    <Box w="100%">
      <Box
        pl={depth * 4}
        cursor={hasChildren ? "pointer" : "default"}
        bg={node.selected ? selectedBg : "transparent"}
        color={node.selected ? selectedColor : "inherit"}
        _hover={{ bg: node.selected ? selectedBg : "gray.100" }}
        onClick={() => {
          if (hasChildren) setExpanded(!expanded);
        }}
        py={1}
        pr={2}
        borderRadius="md"
      >
        <Box display="flex" alignItems="center" gap={2}>
          {hasChildren ? (
            <Icon as={expanded ? LuChevronDown : LuChevronRight} boxSize={4} />
          ) : (
            <Box boxSize={4} />
          )}
          <Text fontFamily="mono">{node.name}</Text>
        </Box>
      </Box>

      {hasChildren && expanded && (
        <VStack align="start" gap={1}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </VStack>
      )}
    </Box>
  );
};
