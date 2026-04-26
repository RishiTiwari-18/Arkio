import { createSlice } from "@reduxjs/toolkit";

interface Chat {
  _id: string;
  title: string;
  messages: any[];
  [key: string]: any;
}

const upsertHistoryItem = (history: Chat[], chat: Chat) => {
  const existingIndex = history.findIndex((item) => item._id === chat._id);

  if (existingIndex === -1) {
    history.unshift(chat);
    return;
  }

  history[existingIndex] = {
    ...history[existingIndex],
    ...chat,
  };
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {} as Record<string, Chat>,
    history: [] as Chat[],
    currentChatId: null as string | null,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },
    addMessages: (state, action) => {
      const { chatId, chat, newMessages } = action.payload;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          ...(chat || {}),
          _id: chatId,
          messages: [],
        };
      }

      state.chats[chatId].messages.push(...newMessages);

      if (chat?._id) {
        upsertHistoryItem(state.history, chat);
      }
    },
    startStreamingMessage: (state, action) => {
      const { chatId, requestId } = action.payload;

      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          _id: chatId,
          messages: [],
          title: "",
        };
      }

      state.chats[chatId].messages.push({
        _id: requestId,
        role: "ai",
        content: "",
        isStreaming: true,
      });
    },
    appendStreamingChunk: (state, action) => {
      const { chatId, requestId, token } = action.payload;
      const target = state.chats[chatId]?.messages?.find(
        (msg: any) => msg._id === requestId && msg.role === "ai",
      );

      if (!target) return;
      target.content = `${target.content || ""}${token || ""}`;
    },
    finishStreamingMessage: (state, action) => {
      const { chatId, requestId, aiMessage } = action.payload;
      const messages = state.chats[chatId]?.messages || [];
      const targetIndex = messages.findIndex(
        (msg: any) => msg._id === requestId && msg.role === "ai",
      );

      if (targetIndex === -1) {
        messages.push(aiMessage);
        return;
      }

      messages[targetIndex] = aiMessage;
    },
    failStreamingMessage: (state, action) => {
      const { chatId, requestId } = action.payload;
      if (!chatId || !state.chats[chatId]) return;
      const messages = state.chats[chatId]?.messages || [];
      state.chats[chatId].messages = messages.filter(
        (msg: any) => !(msg._id === requestId && msg.role === "ai"),
      );
    },
    setMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      if (!state.chats[chatId]) {
        state.chats[chatId] = {
          _id: chatId,
          messages: [],
          title: "",
        };
      }
      state.chats[chatId].messages = messages;
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetChatState: (state) => {
      state.chats = {};
      state.history = [];
      state.currentChatId = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setCurrentChatId,
  addMessages,
  startStreamingMessage,
  appendStreamingChunk,
  finishStreamingMessage,
  failStreamingMessage,
  setMessages,
  setLoading,
  setError,
  setHistory,
  resetChatState,
} = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
