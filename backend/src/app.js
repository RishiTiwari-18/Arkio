import cookieParser from 'cookie-parser';
import express from 'express';

const app = express();

app.use(express.json());
app.use(cookieParser())

app.get('/', (req, res) => {
	res.status(200).json({ message: 'Server is running' });
});

export default app;
