import express from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.routes.js';
import { financeRouter } from './modules/finance/finance.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', service: 'financeiro-mei-simples-api' });
});

app.use('/api/auth', authRouter);
app.use('/api', financeRouter);

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: 'Erro interno no servidor.' });
});

export { app };
