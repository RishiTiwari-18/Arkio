import 'dotenv/config';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { createServer } from "http";
import { SocketServer } from './src/sockets/server.socket.js';

const http = createServer(app)

const PORT = process.env.PORT || 3000;
connectDB();

SocketServer(http)

http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

