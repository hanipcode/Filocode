import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Provider } from "./components/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const container = document.getElementById("root");

const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
