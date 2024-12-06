import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import router from './routers/route';

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </AuthProvider>
  )
}