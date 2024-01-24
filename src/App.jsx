import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoutes from './utils/PrivateRoutes'
import { AuthProvider } from './utils/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import MainComponent from './components/MainComponent'
import Profiles from './ProfileRoute/profile_route'


function App() {

  return (
    <Router>
       <main className='flex w-full items-center justify-center h-screen mainBg text-white overflow-hidden'>
        <AuthProvider>
           <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<MainComponent/>}/>
              <Route path="/username" element={<Profiles/>}/>
            </Route>
          </Routes>
        </AuthProvider>
        </main>
    </Router>
  )
}

export default App
