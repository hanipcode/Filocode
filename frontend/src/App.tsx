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
    <div className="flex gap-4">
      <div className="flex flex-col w-[30dvw] h-[100dvh] border-r  border-gray-200 items-start">
        <div className="flex border-b border-gray-200 p-4 justify-between w-full">
          <h1 className="text-2xl font-semibold">Context AI</h1>
        </div>
        <div className="flex flex-col gap-3 py-3 pb-8 border-b border-gray-200 w-full px-8 text-center">
          <p>Start Creating Project</p>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              SelectDirectory("Select directory");
            }}
          >
            Add Folder
          </button>
        </div>
        <div className="flex flex-col items-start w-full">
          {data && <FileTree nodes={data} />}
        </div>
      </div>
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
    </div>
  );
};
