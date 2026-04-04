import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addMessages,
  appendStreamingChunk,
  failStreamingMessage,
  finishStreamingMessage,
  setError,
  setHistory,
  setLoading,
  setMessages,
  setCurrentChatId,
  startStreamingMessage,
} from "../chats.slice";
import {
  deleteChat,
  getChats,
  getMessage,
} from "../services/chat.service";
import { initializeSocketClient } from "../services/chat.socket";
import type { chatPayload } from "../types";

const useChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendMessage = async ({ message, chatId, image }: chatPayload) => {
    dispatch(setLoading(true));

    const socket = initializeSocketClient();
    const requestId = crypto.randomUUID();

    return new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        socket.off("chat:stream:start", onStart);
        socket.off("chat:stream:chunk", onChunk);
        socket.off("chat:stream:end", onEnd);
        socket.off("chat:stream:error", onError);
      };

      const onStart = (payload: any) => {
        if (payload?.requestId !== requestId) return;

        dispatch(
          startStreamingMessage({
            chatId: payload.chatId,
            requestId,
          }),
        );
      };

      const onChunk = (payload: any) => {
        if (payload?.requestId !== requestId) return;

        dispatch(
          appendStreamingChunk({
            chatId: payload.chatId,
            requestId,
            token: payload.token,
          }),
        );
      };

      const onEnd = (payload: any) => {
        if (payload?.requestId !== requestId) return;

        dispatch(
          finishStreamingMessage({
            chatId: payload.chatId,
            requestId,
            aiMessage: payload.aiMessage,
          }),
        );

        cleanup();
        dispatch(setLoading(false));
        resolve();
      };

      const onError = (payload: any) => {
        if (payload?.requestId !== requestId) return;

        dispatch(
          failStreamingMessage({
            chatId: chatId || payload.chatId,
            requestId,
          }),
        );
        dispatch(setError(payload?.message || "Failed to send message"));

        cleanup();
        dispatch(setLoading(false));
        reject(new Error(payload?.message || "Failed to send message"));
      };

      socket.on("chat:stream:start", onStart);
      socket.on("chat:stream:chunk", onChunk);
      socket.on("chat:stream:end", onEnd);
      socket.on("chat:stream:error", onError);

      socket.emit(
        "chat:send",
        {
          message,
          chatId,
          image,
          requestId,
        },
        (ack: any) => {
          if (!ack?.success) {
            cleanup();
            dispatch(setLoading(false));
            dispatch(setError(ack?.message || "Failed to send message"));
            reject(new Error(ack?.message || "Failed to send message"));
            return;
          }

          dispatch(
            addMessages({
              chatId: ack.chatId,
              chat: ack.chat,
              newMessages: [ack.userMessage],
            }),
          );

          if (!chatId) {
            navigate(`/chat/${ack.chatId}`);
            dispatch(setCurrentChatId(ack.chatId));
          }
        },
      );
    });
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
