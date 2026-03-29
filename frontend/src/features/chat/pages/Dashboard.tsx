import { useSelector } from "react-redux"

export default function dashboard() {
    const {user} = useSelector((state: any) => state.auth)
    console.log(user)
  return (
    <div>
      Dashboard
    </div>
  )
}
