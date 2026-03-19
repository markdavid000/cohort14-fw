import { AppLayout } from './components/layout';
import { Dashboard } from './pages/Dashboard';
import { AppProvider } from './context';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AppProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
      <Toaster position="top-right" />
    </AppProvider>
  );
}

export default App;
