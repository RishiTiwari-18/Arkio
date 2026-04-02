import { RouterProvider } from "react-router-dom";
import routes from "./app.routes";
import { useEffect } from "react";
import useAuth from "@/features/auth/hooks/useAuth";

export default function App() {
  const { handleGetMe } = useAuth()


  useEffect(() => {
    handleGetMe();
  }, []);

  return <RouterProvider router={routes} />;
}
