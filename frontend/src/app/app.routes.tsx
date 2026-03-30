import { createBrowserRouter } from "react-router-dom";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import Dashboard from "../features/chat/pages/Dashboard";
import Protected from "@/features/auth/components/Protected";
import NotFound from "@/components/shared/not-found";

const routes = createBrowserRouter([
  {path: "/", element: <Protected><Dashboard/></Protected>},
  {path: "/login", element: <LoginPage/>},
  {path: "/register", element: <RegisterPage/>},
  {path: "*", element: <NotFound/>},
])

export default routes