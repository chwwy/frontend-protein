import { RouterProvider } from 'react-router-dom'
import router from './routers/route'

export default function App() {
 return (
   <div className="min-h-screen">
     <RouterProvider router={router} />
   </div>
 )
}
