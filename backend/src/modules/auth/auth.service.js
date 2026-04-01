import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../database/pool.js';
import { env } from '../../config/env.js';

export async function registerUser({ name, email, password }) {
  const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (userExists.rowCount > 0) {
    return { error: 'Este email já foi cadastrado.' };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    'INSERT INTO users(name, email, password_hash) VALUES($1, $2, $3) RETURNING id, name, email',
    [name, email, passwordHash],
  );

  const user = result.rows[0];
  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });

  return { user, token };
}

export async function loginUser({ email, password }) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rowCount === 0) {
    return { error: 'Email ou senha inválidos.' };
  }

  const user = result.rows[0];
  const validPassword = await bcrypt.compare(password, user.password_hash);
  if (!validPassword) {
    return { error: 'Email ou senha inválidos.' };
  }

  const token = jwt.sign({ id: user.id, email: user.email }, env.jwtSecret, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}
