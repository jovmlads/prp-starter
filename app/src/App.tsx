import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './features/auth/components/LoginPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

function App() {
  const handleLoginSuccess = () => {
    console.log('User logged in successfully');
    // Here you would typically redirect to the main app
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password page');
    // Here you would typically navigate to forgot password flow
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <LoginPage 
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
