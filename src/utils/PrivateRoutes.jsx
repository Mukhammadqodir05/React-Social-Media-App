import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const PrivateRoutes = () => {
    const {user} = useAuth()

    return user ? <Outlet/> : <Navigate to="/Users-login"/>
}

export default PrivateRoutes