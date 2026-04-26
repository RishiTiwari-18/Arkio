import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import { Spinner } from "@/components/ui/spinner"

const Protected = ({ children }: { children: React.ReactNode }) => {
    const user = useSelector((state: any) => state.auth.user)
    const loading = useSelector((state: any) => state.auth.loading)

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Spinner className="size-8 text-primary" />
            </div>
        )
    }

    if(!user) {
        return <Navigate to="/login"/>
    }

    return <>{children}</>
}

export default Protected