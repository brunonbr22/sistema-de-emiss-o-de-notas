import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { addMovement, getMonthlyDashboard, getMovements } from './finance.controller.js';

const financeRouter = Router();

financeRouter.use(authMiddleware);
financeRouter.get('/dashboard', getMonthlyDashboard);
financeRouter.get('/movements', getMovements);
financeRouter.post('/movements', addMovement);

export { financeRouter };
