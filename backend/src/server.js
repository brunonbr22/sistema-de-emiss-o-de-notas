import { app } from './app.js';
import { env } from './config/env.js';

if (!env.databaseUrl) {
  throw new Error('Defina DATABASE_URL no arquivo backend/.env');
}

app.listen(env.port, () => {
  console.log(`API rodando em http://localhost:${env.port}`);
});
