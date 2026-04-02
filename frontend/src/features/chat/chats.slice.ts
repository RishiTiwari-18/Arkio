import { createSlice } from "@reduxjs/toolkit";

interface Chat {
  _id: string;
  messages: any[];
  [key: string]: any;
}

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    chats: {} as Record<string, Chat>,
    history: [] as string[],
    loading: false,
    error: null,
  },
  reducers: {
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
    setHistory: (state, action) => {
        state.history = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { addMessages, setLoading, setError, setHistory } = chatSlice.actions;
const chatReducer = chatSlice.reducer;
export default chatReducer;
