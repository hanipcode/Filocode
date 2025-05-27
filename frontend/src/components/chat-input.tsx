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
    <div className="p-2 border-t border-gray-200">
      <div className="flex gap-2">
        <input
          type="text"
          className="border rounded py-2 px-3 w-full focus:outline-none focus:ring focus:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <button
          aria-label="Send"
          onClick={onSend}
          disabled={isSending}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          <LuSend />
        </button>
      </div>
    </div>
  );
};
