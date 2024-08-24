import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/layout'
import { Toaster } from './components/ui/toast/toaster'
import Steps from './steps'
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Steps />
      </Layout>
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
