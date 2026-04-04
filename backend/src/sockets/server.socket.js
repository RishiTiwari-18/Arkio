import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateContentStream, generateTitle } from "../services/ai.service.js";

let io;

const parseCookies = (cookieHeader = "") => {
    return cookieHeader
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce((acc, part) => {
            const splitAt = part.indexOf("=");
            if (splitAt === -1) return acc;
            const key = part.slice(0, splitAt);
            const value = decodeURIComponent(part.slice(splitAt + 1));
            acc[key] = value;
            return acc;
        }, {});
};

export function SocketServer(app) {
    io = new Server(app, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
    })

    io.use((socket, next) => {
        try {
            const cookies = parseCookies(socket.handshake.headers.cookie || "");
            const token = cookies.token;

            if (!token) {
                return next(new Error("Unauthorized"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = decoded;
            return next();
        } catch {
            return next(new Error("Unauthorized"));
        }
    });

    console.log("socket server running");

    io.on("connection", (socket) => {
        console.log("user connected ", socket.id);

        socket.on("chat:send", async (payload, callback) => {
            const respond = typeof callback === "function" ? callback : () => {};
            let ackSent = false;

            const respondOnce = (data) => {
                if (ackSent) return;
                ackSent = true;
                respond(data);
            };

            try {
                const userId = socket.user?.id;

                if (!userId) {
                    respondOnce({ success: false, message: "Unauthorized" });
                    return;
                }

                const { message, chatId, image, requestId } = payload || {};
                const normalizedMessage = (message || "").trim();

                if (!requestId) {
                    respondOnce({ success: false, message: "requestId is required" });
                    return;
                }

                if (!normalizedMessage && !image) {
                    respondOnce({ success: false, message: "Message or image is required" });
                    return;
                }

                if (image && !/^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(image)) {
                    respondOnce({ success: false, message: "Invalid image format" });
                    return;
                }

                let chat = null;

                if (!chatId) {
                    const title = await generateTitle(normalizedMessage || "Image analysis request");
                    chat = await chatModel.create({
                        user: userId,
                        title,
                    });
                } else {
                    const existingChat = await chatModel.findOne({ _id: chatId, user: userId });
                    if (!existingChat) {
                        respondOnce({ success: false, message: "Chat not found" });
                        return;
                    }
                }

                const currentChatId = chatId || chat._id.toString();

                const userMessage = await messageModel.create({
                    chat: currentChatId,
                    user: userId,
                    role: "user",
                    content: normalizedMessage || "Please analyze this image.",
                    image: image || null,
                });

                respondOnce({
                    success: true,
                    chatId: currentChatId,
                    chat,
                    userMessage,
                    requestId,
                });

                socket.emit("chat:stream:start", {
                    chatId: currentChatId,
                    requestId,
                });

                const allMessages = await messageModel
                    .find({ chat: currentChatId })
                    .sort({ createdAt: 1 });

                const aiContent = await generateContentStream(allMessages, {
                    onToken: (token) => {
                        socket.emit("chat:stream:chunk", {
                            chatId: currentChatId,
                            requestId,
                            token,
                        });
                    },
                });

                const aiMessage = await messageModel.create({
                    chat: currentChatId,
                    user: userId,
                    role: "ai",
                    content: aiContent,
                });

                socket.emit("chat:stream:end", {
                    chatId: currentChatId,
                    requestId,
                    aiMessage,
                });
            } catch (error) {
                const requestId = payload?.requestId;
                socket.emit("chat:stream:error", {
                    requestId,
                    message: "Failed to generate response. Please try again.",
                });

                respondOnce({ success: false, message: "Failed to generate response. Please try again." });

                console.error("Socket chat error:", error);
            }
        });
    });

}

export function getIO(){
    if(!io){
        throw new Error("Socket not initialized")
    }

    return io
}