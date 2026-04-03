import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addMessages, setError, setHistory, setLoading, setMessages, setCurrentChatId } from "../chats.slice";
import {
  createChat,
  deleteChat,
  getChats,
  getMessage,
  sendMessage,
} from "../services/chat.service";
import { initializeSocketClient } from "../services/chat.socket";
import type { chatPayload } from "../types";

const useChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendMessage = async ({ message, chatId }: chatPayload) => {
    try {
      dispatch(setLoading(true));
      const data = await sendMessage({ message, chatId });
      dispatch(
        addMessages({
          chatId: data.chatId,
          chat: data.chat,
          newMessages: data.newMessages,
        })
      );
      
      // Navigate to chat if it's a new chat
      if (!chatId) {
        navigate(`/chat/${data.chatId}`);
        dispatch(setCurrentChatId(data.chatId));
      }

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
      dispatch(setHistory(res.chats));
      return res.chats;
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
      dispatch(setMessages({ chatId, messages: res.messages }));
      dispatch(setCurrentChatId(chatId));
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

  const handleNavigateToChat = (chatId: string) => {
    dispatch(setCurrentChatId(chatId));
    navigate(`/chat/${chatId}`);
  };
  
  return {
    initializeSocketClient,
    handleSendMessage,
    handleGetChats,
    handleGetMessage,
    handledDeleteChat,
    handleNavigateToChat,
  };
};

export default useChat;
