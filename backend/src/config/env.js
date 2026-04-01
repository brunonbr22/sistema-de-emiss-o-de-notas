import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 3001),
  jwtSecret: process.env.JWT_SECRET || 'troque-em-producao',
  databaseUrl: process.env.DATABASE_URL || '',
};
