import cookieParser from 'cookie-parser';
import express from 'express';
import authRouter from './routes/auth.route.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

const app = express();

app.use(express.json());
app.use(cookieParser())


//* routes

app.use("/api/auth", authRouter)

// app.get('/', (req, res) => {
// 	res.status(200).json({ message: 'Server is running' });
// });

app.use(notFound)
app.use(errorHandler)

export default app;
