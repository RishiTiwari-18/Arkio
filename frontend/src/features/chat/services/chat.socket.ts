import {io} from "socket.io-client"

export const initializeSocketClient = () => {
    const socket = io("http://localhost:3000",{
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("connected to socket io")
    })
}

