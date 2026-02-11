import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';

function App() {
  useEffect(() => {
    // Apply dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
