
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import App from './App'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SocketContextProvider } from './context/SocketContext';
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <SocketContextProvider>

      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>

    </SocketContextProvider>
  </BrowserRouter>
)
