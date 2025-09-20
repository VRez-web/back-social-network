import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  user: process.env.USER_DATABASE,
  database: process.env.NAME_DATABASE,
  password: process.env.PASS_DATABASE,
  port: 5432
})