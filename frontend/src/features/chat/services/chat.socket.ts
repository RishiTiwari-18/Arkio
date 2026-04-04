import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";
    return apiUrl.replace(/\/api\/?$/, "");
};

export const initializeSocketClient = () => {
    if (!socket) {
        socket = io(getSocketUrl(), {
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.log("connected to socket io");
        });
    }

    if (!socket.connected) {
        socket.connect();
    }

    return socket;
};

export const getSocketClient = () => socket;

