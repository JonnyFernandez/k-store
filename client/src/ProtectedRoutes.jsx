import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "./context/AuthContext"

const ProtectedRoute = () => {

    const { Loading, isAuthenticated } = useAuth()


    if (Loading) return <h1> Loading...</h1>

    if (!Loading && !isAuthenticated) return <Navigate to={'/'} replace />

    return (
        <Outlet />
    )
}

export default ProtectedRoute
