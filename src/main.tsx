
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import App from './App.tsx'
import './index.css'

console.log("loaded env" ,import.meta.env.VITE_API_URL)

const queryClient = new  QueryClient({
  defaultOptions:{
    queries: { 
      refetchOnWindowFocus: false,
      retry: 3
    }
  }
})

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter>,
)
