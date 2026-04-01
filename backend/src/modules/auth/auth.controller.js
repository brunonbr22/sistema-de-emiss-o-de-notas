import { loginUser, registerUser } from './auth.service.js';

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha nome, email e senha.' });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres.' });
  }

  const result = await registerUser({ name, email, password });

  if (result.error) {
    return res.status(409).json({ message: result.error });
  }

  return res.status(201).json(result);
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Preencha email e senha.' });
  }

  const result = await loginUser({ email, password });

  if (result.error) {
    return res.status(401).json({ message: result.error });
  }

  return res.json(result);
}
