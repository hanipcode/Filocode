import { Box, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type ChatContainerProps = {
  children: ReactNode;
};

export const ChatContainer = ({ children }: ChatContainerProps) => {
  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      flexGrow={1}
      p={4}
      bg="white"
    >
      <VStack flex="1" align="stretch" gap={0} overflow="hidden">
        {children}
      </VStack>
    </Box>
  );
};
