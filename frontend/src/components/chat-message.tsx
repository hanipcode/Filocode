import { Box, Text } from "@chakra-ui/react";
import { useColorModeValue } from "./color-mode";

export type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";
  const bg = useColorModeValue(
    isUser ? "blue.100" : "gray.100",
    isUser ? "blue.700" : "gray.700",
  );
  const color = isUser ? "black" : "gray.700";
  const align = isUser ? "flex-end" : "flex-start";

  return (
    <Box display="flex" justifyContent={align} w="100%" px={2}>
      <Box
        bg={bg}
        color={color}
        px={4}
        py={2}
        borderRadius="md"
        maxW="80%"
        whiteSpace="pre-wrap"
      >
        <Text fontSize="sm" fontFamily="mono">
          {content}
        </Text>
      </Box>
    </Box>
  );
};
