import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './routes/auth.route.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';
import cors from 'cors';
import morgan from 'morgan';
import chatRouter from './routes/chat.route.js';

const app = express();

app.use(express.json({ limit: '12mb' }));
app.use(cookieParser())
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}))
app.use(morgan('dev'))


//* routes

app.use("/api/auth", authRouter)
app.use("/api/chats", chatRouter)

// app.get('/', (req, res) => {
// 	res.status(200).json({ message: 'Server is running' });
// });

app.use(notFound)
app.use(errorHandler)

export default app;
