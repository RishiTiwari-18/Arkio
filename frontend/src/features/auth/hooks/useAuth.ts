import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice";
import { getMeApi, loginApi, registerApi } from "../services/auth.service";
import type { LoginPayload, RegisterPayload } from "../types";

const useAuth = () => {
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginPayload) => {
    try {
      dispatch(setLoading(true));
      const res = await loginApi(data);
      dispatch(setUser(res.user));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (data: RegisterPayload) => {
    try {
      dispatch(setLoading(true));
      const res = await registerApi(data);
      dispatch(setUser(res.user));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getMeApi();
      dispatch(setUser(res.user));
    } catch (error: any) {
      dispatch(setError(error.response?.data?.message));
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return { handleLogin, handleRegister, handleGetMe };
};

export default useAuth;
