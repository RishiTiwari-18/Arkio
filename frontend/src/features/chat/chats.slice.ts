import { createSlice } from "@reduxjs/toolkit";

interface Chat {
  _id: string;
  title: string;
  messages: any[];
  [key: string]: any;
}

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
  },
});

export const { setCurrentChatId, addMessages, setMessages, setLoading, setError, setHistory } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
