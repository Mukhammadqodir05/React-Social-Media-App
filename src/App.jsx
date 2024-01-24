import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Home from './components/HomeComponents/Home'
import Profiles from './components/ProfileRoute/profile_route'


const App = () => {

  return (
    <Router>
       <main className='flex w-full items-center justify-center h-screen mainBg text-white overflow-hidden'>
         <AuthProvider>
           <Routes>
            {/* Public Routes */}
            <Route path="/Users-login" element={<Login/>}/>
            <Route path="/Users-register" element={<Register/>}/>
            
            {/* Private Routes */}
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Home/>}/>
              <Route path="/username" element={<Profiles/>}/>
            </Route>
          </Routes>
         </AuthProvider>
        </main>
    </Router>
  )
}

export default App
