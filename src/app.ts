import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import notFound from './errors/notFound';
import globalErrorHandler from './errors/globalErrorHandler';
import router from './routes';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser())



// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Contest Hub!');
});

app.use(notFound)
app.use(globalErrorHandler)

export default app;
