import { Box, Input, IconButton, HStack } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";

type ChatInputProps = {
  value: string;
  onChange: (val: string) => void;
  onSend: () => void;
  isSending?: boolean;
};

export const ChatInput = ({
  value,
  onChange,
  onSend,
  isSending,
}: ChatInputProps) => {
  return (
    <Box p={2} borderTop="1px solid" borderColor="gray.200">
      <HStack gap={2}>
        <Input
          placeholder="Type your message..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          disabled={isSending}
        />
        <IconButton
          aria-label="Send"
          onClick={onSend}
          loading={isSending}
          colorScheme="blue"
        >
          <LuSend />
        </IconButton>
      </HStack>
    </Box>
  );
};
