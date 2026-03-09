import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/global.scss";import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(  <QueryClientProvider client={queryClient}>
    <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#ffffff",
            color: "#1e293b",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px rgba(91, 91, 214, 0.12)",
            padding: "14px 16px",
            fontSize: "14px",
          },
        }}
      /> <App />
  </QueryClientProvider>);
