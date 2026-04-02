import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogle } from "@langchain/google";
import { HumanMessage, SystemMessage, AIMessage } from "langchain"

const mistral = new ChatMistralAI({
model: "mistral-small-latest",
});

const google = new ChatGoogle({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash-lite",
});

export const generateContent = async (message) => {
    const formattedMessages = message.map(msg => {
        if (msg.role === "user") return new HumanMessage(msg.content)    
        if (msg.role === "ai") return new AIMessage(msg.content)    
    })

    const response = await google.invoke(formattedMessages)
    return response.content
}

export const generateTitle = async (message) => {
    const response = await mistral.invoke([
        new SystemMessage(`You are a helpful assistant that generates titles for the given content.
            user will provide you with some content and you will generate a title for that content. The title should be concise and should capture the essence of the content. The title should be between 5 and 10 words.
            Return only plain title text as a single line. Do not use quotes, markdown, bullets, prefixes, or suffixes.`),
        new HumanMessage(`generate a title for the following content: ${message}`)
    ])

    return response.content
}