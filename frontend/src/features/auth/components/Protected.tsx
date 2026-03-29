import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

const Protected = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: any) => state.auth.user)
    const loading = useSelector((state: any) => state.auth.loading)

    if (loading) {
        return <div>Loading...</div>
    }

    if(!user) {
        return <Navigate to="/login"/>
    }

    return <>{children}</>
}

export default Protected