import { useSelector } from "react-redux"
import useChat from "../hooks/useChat"
import { useEffect } from "react"

export default function dashboard() {
    const {initializeSocketClient} = useChat()
    const {user} = useSelector((state: any) => state.auth)
    console.log(user)

    useEffect(() => {
      initializeSocketClient()
    },[])
  return (
    <div>
      Dashboard
    </div>
  )
}
