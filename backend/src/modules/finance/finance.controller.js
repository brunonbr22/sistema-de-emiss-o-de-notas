import { createMovement, getDashboard, listMovements } from './finance.service.js';

export async function addMovement(req, res) {
  const { type, amount, description, date } = req.body;
  const parsedAmount = Number(amount);

  if (!['entrada', 'gasto'].includes(type)) {
    return res.status(400).json({ message: 'Tipo inválido.' });
  }

  if (!description || !date || !parsedAmount || parsedAmount <= 0) {
    return res.status(400).json({ message: 'Preencha todos os campos corretamente.' });
  }

  const movement = await createMovement({
    userId: req.user.id,
    type,
    amount: parsedAmount,
    description,
    date,
  });

  return res.status(201).json(movement);
}

export async function getMovements(req, res) {
  const movements = await listMovements(req.user.id);
  return res.json(movements);
}

export async function getMonthlyDashboard(req, res) {
  const now = new Date();
  const year = Number(req.query.year || now.getUTCFullYear());
  const month = Number(req.query.month || now.getUTCMonth() + 1);

  const dashboard = await getDashboard({ userId: req.user.id, year, month });
  return res.json(dashboard);
}
