import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import usersRoutes from './routes/users';
import postsRoutes from './routes/posts';
import commentsRoutes from './routes/comments';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/users', usersRoutes);
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

app.get('/', (_, res) => {
    res.json({ message: 'API running' });
});

export default app;
