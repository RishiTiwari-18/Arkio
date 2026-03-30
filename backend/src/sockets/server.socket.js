import { Server } from "socket.io";
let io

export function SocketServer(app) {
    io = new Server(app, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        },
    })

    console.log("socket server running")

    io.on("connection", (socket) => {
        console.log("user connected ", socket.id)
    })

}

export function getIO(){
    if(!io){
        throw new Error("Socket not initialized")
    }

    return io
}