import { useDispatch } from "react-redux";
import { setUser, setLoading, setError } from "../auth.slice";
import { getMeApi, loginApi, registerApi } from "../services/auth.service";
import type { LoginPayload, RegisterPayload } from "../types";

const getErrorMessage = (error: any) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

const useAuth = () => {
  const dispatch = useDispatch();

  const handleLogin = async (data: LoginPayload) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const res = await loginApi(data);
      dispatch(setUser(res.user));
      return res;
    } catch (error: any) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleRegister = async (data: RegisterPayload) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const res = await registerApi(data);
      dispatch(setUser(res.user));
      return res;
    } catch (error: any) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMe = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));
      const res = await getMeApi();
      dispatch(setUser(res.user));
      return res;
    } catch (error: any) {
      const message = getErrorMessage(error);
      dispatch(setError(message));
      throw new Error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return { handleLogin, handleRegister, handleGetMe };
};

export default useAuth;
