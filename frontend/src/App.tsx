import { Button, Flex, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ColorModeButton } from "./components/color-mode";
import { Chat, GetContexts, SelectDirectory } from "../wailsjs/go/main/App";
import { useQuery } from "@tanstack/react-query";
import { FileTree } from "./components/filetree";
import { ChatContainer } from "./components/chat-container";
import { ChatInput } from "./components/chat-input";
import { ChatWindow } from "./components/chat-window";
import { useState } from "react";
import { ChatMessageProps } from "./components/chat-message";

const useContextQuery = () => {
  return useQuery({
    queryKey: ["contexts"],
    queryFn: () => GetContexts(),
  });
};

export const App = () => {
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { data } = useContextQuery();
  return (
    <Flex gap="4">
      <VStack w="30dvw" h="dvh" borderRightWidth="1px" align="left">
        <HStack borderBottomWidth="1px" p="4" justify="space-between">
          <Heading>Context AI</Heading>
          <ColorModeButton />
        </HStack>
        <VStack gap="3" py="3" pb="8" borderBottomWidth={1}>
          <Text>Start Creating Project</Text>
          <Button
            onClick={() => {
              SelectDirectory("Select directory");
            }}
          >
            Add Folder
          </Button>
        </VStack>
        <VStack align="start">{data && <FileTree nodes={data} />}</VStack>
      </VStack>
      <ChatContainer>
        <ChatWindow messages={messages} />
        <ChatInput
          value={input}
          onChange={setInput}
          isSending={isSending}
          onSend={() => {
            if (!input.trim()) return;
            setIsSending(true);
            setMessages((messages) => [
              ...messages,
              { role: "user", content: input },
            ]);
            setInput("");
            Chat(input)
              .then((m) => {
                setMessages((messages) => [
                  ...messages,
                  { role: "assistant", content: m },
                ]);
              })
              .finally(() => {
                setIsSending(false);
              });
          }}
        />
      </ChatContainer>
    </Flex>
  );
};
