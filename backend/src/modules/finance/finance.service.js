import { pool } from '../../database/pool.js';

export async function createMovement({ userId, type, amount, description, date }) {
  const result = await pool.query(
    `INSERT INTO movements(user_id, type, amount, description, movement_date)
     VALUES($1, $2, $3, $4, $5)
     RETURNING id, type, amount::float AS amount, description, movement_date`,
    [userId, type, amount, description, date],
  );

  return result.rows[0];
}

export async function listMovements(userId) {
  const result = await pool.query(
    `SELECT id, type, amount::float AS amount, description, movement_date
     FROM movements
     WHERE user_id = $1
     ORDER BY movement_date DESC, id DESC`,
    [userId],
  );

  return result.rows;
}

export async function getDashboard({ userId, year, month }) {
  const monthly = await pool.query(
    `SELECT
      COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE 0 END), 0)::float AS entradas,
      COALESCE(SUM(CASE WHEN type = 'gasto' THEN amount ELSE 0 END), 0)::float AS gastos
    FROM movements
    WHERE user_id = $1
      AND EXTRACT(YEAR FROM movement_date) = $2
      AND EXTRACT(MONTH FROM movement_date) = $3`,
    [userId, year, month],
  );

  const balance = await pool.query(
    `SELECT COALESCE(SUM(CASE WHEN type = 'entrada' THEN amount ELSE -amount END), 0)::float AS saldo
     FROM movements
     WHERE user_id = $1`,
    [userId],
  );

  const entradasMes = monthly.rows[0].entradas;
  const gastosMes = monthly.rows[0].gastos;

  return {
    ano: year,
    mes: month,
    entradasMes,
    gastosMes,
    lucroMes: entradasMes - gastosMes,
    saldoAtual: balance.rows[0].saldo,
  };
}
