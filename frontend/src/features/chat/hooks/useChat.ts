import { useDispatch } from "react-redux";
import { setChats, setError, setLoading } from "../chats.slice";
import {
  deleteChat,
  getChats,
  getMessage,
  sendMessage,
} from "../services/chat.service";
import { initializeSocketClient } from "../services/chat.socket";
import type { chatPayload } from "../types";

const useChat = () => {
  const dispatch = useDispatch();

  const handleSendMessage = async ({ message, chatId }: chatPayload) => {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      const {chat, aiMessage} = data
      dispatch(setChats((prev: any) => {
        return {
          ...prev, [chat.title]: {
            ...chat,
            messages: [{content: message, role: "user"}, aiMessage]
          }
        }
      }))

    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to send message"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));
      const res = await getChats();
      return res;
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch chats"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleGetMessage = async (chatId: string) => {
    try {
      dispatch(setLoading(true));
      const res = await getMessage(chatId);
      return res;
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to fetch messages"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handledDeleteChat = async (chatId: string) => {
    try {
      dispatch(setLoading(true));
      const res = await deleteChat(chatId);
      return res;
    } catch (error: any) {
      dispatch(
        setError(error.response?.data?.message || "Failed to delete chat"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };
  
  return {
    initializeSocketClient,
    handleSendMessage,
    handleGetChats,
    handleGetMessage,
    handledDeleteChat,
  };
};

export default useChat;
