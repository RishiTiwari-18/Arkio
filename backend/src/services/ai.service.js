import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogle } from "@langchain/google";
import { HumanMessage } from "langchain"

const mistral = new ChatMistralAI({
model: "mistral-small-latest",
});

const google = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

export const generateContent = async (message) => {
    const response = await google.invoke([
        new HumanMessage(message)
    ])

    return response.content
}