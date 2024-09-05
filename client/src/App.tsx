import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout'
import Reconnect from './components/reconnect'
import { Toaster } from './components/ui/toast/toaster'
import Steps from './steps'
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 2000,
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Steps />
        <Reconnect />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
