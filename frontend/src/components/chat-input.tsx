import { LuSend } from "react-icons/lu";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
    <div className="p-2 border-t border-gray-200">
      <div className="flex gap-2">
        <Input
          type="text"
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
        <Button aria-label="Send" onClick={onSend} disabled={isSending}>
          <LuSend />
        </Button>
      </div>
    </div>
  );
};
