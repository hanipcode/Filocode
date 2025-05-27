import { useColorModeValue } from "./color-mode";

export type ChatMessageProps = {
  role: "user" | "assistant";
  content: string;
};

export const ChatMessage = ({ role, content }: ChatMessageProps) => {
  const isUser = role === "user";

  const bgLightUser = "blue-100";
  const bgDarkUser = "blue-700";
  const bgLightAssistant = "gray-100";
  const bgDarkAssistant = "gray-700";

  const bgUser = useColorModeValue(bgLightUser, bgDarkUser);
  const bgAssistant = useColorModeValue(bgLightAssistant, bgDarkAssistant);
  const bg = isUser ? `bg-${bgUser}` : `bg-${bgAssistant}`;

  const color = isUser ? "text-black" : "text-gray-700";
  const align = isUser ? "justify-end" : "justify-start";

  return (
    <div className={`flex ${align} w-full px-2`}>
      <div
        className={`${bg} ${color} px-4 py-2 rounded-md max-w-[80%] whitespace-pre-wrap`}
      >
        <p className="text-sm font-mono">{content}</p>
      </div>
    </div>
  );
};
