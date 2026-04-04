import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogle } from "@langchain/google";
import { tavily } from "@tavily/core";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";

const mistral = new ChatMistralAI({
    model: "mistral-small-latest",
});

const google = new ChatGoogle({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash-lite",
});

const fallbackResponse = "I could not generate a response for that image.";
const WEB_CACHE_TTL_MS = 2 * 60 * 1000;
const tavilyCache = new Map();

// Arkio's system prompt
const ARKIO_SYSTEM_PROMPT = `You are Arkio, an AI assistant created by Rishi Tiwari to help users across multiple domains — with special expertise in programming, mental wellness, language, relationships, and creative writing.

## Core Identity
- Be warm, approachable, and genuinely helpful
- Adapt your tone based on the topic: technical for coding, empathetic for mental health, encouraging for creative work
- Never claim to replace professionals (therapists, doctors, lawyers)
- Admit uncertainty honestly — "I'm not sure, but here's what I know..."

## Primary Strengths

### 1. Programming & Development (Your Specialty)
You excel at:
- Explaining concepts in JavaScript, React, Node.js, Express, MongoDB, Next.js, Tailwind CSS
- Debugging code and identifying root causes
- Writing clean, production-ready code with best practices
- Suggesting architectural patterns and scalable solutions
- Reviewing code for performance, security, and maintainability
- Helping with algorithms, data structures, and system design

When helping with code:
- Provide complete, working examples (not pseudocode)
- Explain *why* something works, not just *how*
- Suggest alternatives when relevant
- Use proper markdown with syntax highlighting

### 2. Mental Health & Emotional Support
You provide:
- A safe, non-judgmental space to talk
- Techniques for managing anxiety, stress, and difficult emotions
- Perspective on common challenges (burnout, imposter syndrome, loneliness)
- Encouragement to seek professional help when needed

**Critical boundaries:**
- You are NOT a licensed therapist or psychiatrist
- You cannot diagnose mental health conditions
- You cannot prescribe medication or treatment plans
- For crisis situations (suicidal thoughts, self-harm, abuse), immediately encourage professional help

### 3. Relationships & Communication
You help with:
- Navigating conflicts with empathy and clarity
- Improving communication skills
- Understanding different perspectives
- Setting healthy boundaries
- Building confidence in difficult conversations

### 4. English Language & Writing Skills
You assist with:
- Grammar, spelling, and sentence structure corrections
- Improving clarity, tone, and flow in writing
- Expanding vocabulary and explaining nuances
- Adapting writing for different contexts
- Proofreading essays, emails, resumes, and creative work

### 5. Poetry & Creative Writing
You support:
- Brainstorming ideas and overcoming writer's block
- Analyzing poetic devices
- Providing constructive feedback on drafts
- Writing original poetry when requested

## Response Guidelines

### Tone Adaptation
- **Coding questions:** Direct, technical, solution-focused
- **Mental health:** Warm, empathetic, validating
- **Relationship advice:** Thoughtful, balanced, non-judgmental
- **Writing/poetry:** Encouraging, constructive, curious

### Formatting
- Use markdown for structure (headers, lists, code blocks)
- Break long responses into clear sections
- For code: Always include syntax highlighting
- For poetry: Preserve line breaks and formatting

### Context Awareness
- Remember earlier parts of the conversation
- Connect follow-up questions to the ongoing topic
- If the user switches topics, acknowledge it naturally

## Limitations
You cannot:
- Diagnose medical or mental health conditions
- Provide legal, financial, or medical advice
- Access real-time data unless web search context is explicitly provided
- Execute code or access files on the user's system

## Safety & Refusals
Refuse requests for:
- Malicious code (malware, exploits, hacking tools)
- Content that promotes harm, violence, or illegal activity
- Academic dishonesty (writing entire essays for students)

When refusing:
- Be brief and respectful
- Offer an alternative if possible`;

const shouldUseWebSearch = (query = "") => {
    const normalized = query.toLowerCase();

    if (!normalized.trim()) return false;

    const explicitWebIntent = /(search (the )?web|look(ing)? (it )?up|online|internet|latest update)/i;
    const directFreshInfoIntent = /(what('?s| is) (the )?(date|time) (today|now)|today'?s date|current date|current time)/i;
    const freshnessSignal = /(today|todays|latest|current|now|right now|live|real[- ]time|up[- ]to[- ]date|recent|breaking|as of)/i;
    const dynamicTopicSignal = /(date|time|day|news|headline|stock|share|market|gold|silver|bitcoin|btc|ethereum|eth|crypto|forex|exchange rate|price|rate|weather|temperature|score|match result)/i;

    if (explicitWebIntent.test(normalized)) return true;
    if (directFreshInfoIntent.test(normalized)) return true;

    return freshnessSignal.test(normalized) && dynamicTopicSignal.test(normalized);
};

const getLatestUserQuery = (messages = []) => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
        const msg = messages[i];
        if (msg?.role === "user" && typeof msg.content === "string" && msg.content.trim()) {
            return msg.content.trim();
        }
    }

    return "";
};

const buildWebContext = (searchResponse) => {
    if (!searchResponse) return "";

    const answer = searchResponse.answer ? `Quick answer: ${searchResponse.answer}` : "";
    const sources = (searchResponse.results || [])
        .slice(0, 5)
        .map((item, index) => {
            const title = item?.title || "Untitled source";
            const url = item?.url || "No URL";
            const content = (item?.content || "").replace(/\s+/g, " ").trim();
            return `${index + 1}. ${title}\nURL: ${url}\nSummary: ${content}`;
        })
        .join("\n\n");

    return [answer, sources].filter(Boolean).join("\n\n");
};

const fetchWebContextIfNeeded = async (messages = []) => {
    const query = getLatestUserQuery(messages);

    if (!shouldUseWebSearch(query)) {
        return "";
    }

    if (!process.env.TAVILY_API_KEY) {
        return "";
    }

    const cacheKey = query.toLowerCase();
    const cached = tavilyCache.get(cacheKey);
    const now = Date.now();

    if (cached && now - cached.timestamp < WEB_CACHE_TTL_MS) {
        return cached.context;
    }

    try {
        const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
        const response = await client.search(query, {
            includeAnswer: true,
            maxResults: 5,
            searchDepth: "advanced",
            topic: "general",
            timeout: 20,
        });

        const context = buildWebContext(response);
        tavilyCache.set(cacheKey, {
            timestamp: now,
            context,
        });

        return context;
    } catch (error) {
        console.warn("Tavily search failed, falling back to model-only response.", error?.message || error);
        return "";
    }
};

const formatMessagesForModel = (messages, webContext = "") => {
    const realtimeInstruction = webContext
        ? `WEB_SEARCH_CONTEXT is provided below. Use it for time-sensitive facts (date, prices, markets, breaking updates). If the context does not contain the requested fact, say you are unsure and avoid guessing.\n\nWEB_SEARCH_CONTEXT:\n${webContext}`
        : "No web context is provided. Use your model knowledge only and avoid claiming live or real-time certainty.";

    return [
        new SystemMessage(ARKIO_SYSTEM_PROMPT),
        new SystemMessage(realtimeInstruction),
        ...messages.map((msg) => {
            if (msg.role === "user") {
                if (msg.image) {
                    return new HumanMessage({
                        content: [
                            {
                                type: "text",
                                text: msg.content || "Describe this image in detail.",
                            },
                            {
                                type: "image_url",
                                image_url: msg.image,
                            },
                        ],
                    });
                }

                return new HumanMessage(msg.content);
            }

            if (msg.role === "ai") return new AIMessage(msg.content);
            return undefined;
        }),
    ].filter(Boolean);
};

const getTextFromContent = (content) => {
    if (typeof content === "string") return content;

    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                return part?.text || "";
            })
            .join("");
    }

    return "";
};

export const generateContent = async (messages) => {
    try {
        const webContext = await fetchWebContextIfNeeded(messages);
        const formattedMessages = formatMessagesForModel(messages, webContext);

        const response = await google.invoke(formattedMessages);

        const content = getTextFromContent(response.content).trim();

        return content || fallbackResponse;
    } catch (error) {
        console.error("Error generating content:", error);
        throw new Error("Failed to generate response. Please try again.");
    }
};

export const generateContentStream = async (messages, { onToken } = {}) => {
    try {
        const webContext = await fetchWebContextIfNeeded(messages);
        const formattedMessages = formatMessagesForModel(messages, webContext);
        const stream = await google.stream(formattedMessages);
        let finalText = "";

        for await (const chunk of stream) {
            const token = getTextFromContent(chunk.content);

            if (!token) continue;

            finalText += token;

            if (typeof onToken === "function") {
                onToken(token);
            }
        }

        const normalized = finalText.trim();
        return normalized || fallbackResponse;
    } catch (error) {
        console.error("Error streaming content:", error);
        throw new Error("Failed to generate response. Please try again.");
    }
};

export const generateTitle = async (message) => {
    try {
        const response = await mistral.invoke([
            new SystemMessage(
                `You are a helpful assistant that generates titles for the given content.
User will provide you with some content and you will generate a title for that content. The title should be concise and should capture the essence of the content. The title should be between 5 and 10 words.
Return only plain title text as a single line. Do not use quotes, markdown, bullets, prefixes, or suffixes.`
            ),
            new HumanMessage(`generate a title for the following content: ${message}`),
        ]);

        return response.content;
    } catch (error) {
        console.error("Error generating title:", error);
        throw new Error("Failed to generate title. Please try again.");
    }
};