import { Box, VStack } from "@chakra-ui/react";
import { ChatMessageProps, ChatMessage } from "./chat-message";

type ChatWindowProps = {
  messages: ChatMessageProps[];
};

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <Box flex="1" overflowY="auto" p={4} borderRadius="md" w="100%">
      <VStack gap={3} align="stretch">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
      </VStack>
    </Box>
  );
};
