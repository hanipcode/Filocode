import { ChatMessageProps, ChatMessage } from "./chat-message";

type ChatWindowProps = {
  messages: ChatMessageProps[];
};

export const ChatWindow = ({ messages }: ChatWindowProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 rounded-md w-full">
      <div className="flex flex-col gap-3 items-stretch">
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} role={msg.role} content={msg.content} />
        ))}
      </div>
    </div>
  );
};
