import { ReactNode } from "react";

type ChatContainerProps = {
  children: ReactNode;
};

export const ChatContainer = ({ children }: ChatContainerProps) => {
  return (
    <div className="h-[100vh] flex flex-col flex-grow-1 p-4 bg-white">
      <div className="flex-1 flex flex-col items-stretch gap-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
};
