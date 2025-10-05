import pkg from 'pg';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const { Pool } = pkg;

console.log('db.js - PASS_DATABASE:', process.env.PASS_DATABASE);
console.log('db.js - USER_DATABASE:', process.env.USER_DATABASE);
console.log('db.js - NAME_DATABASE:', process.env.NAME_DATABASE);
console.log('db.js - password type:', typeof process.env.PASS_DATABASE);

export const pool = new Pool({
  user: process.env.USER_DATABASE,
  database: process.env.NAME_DATABASE,
  password: process.env.PASS_DATABASE,
  port: 5432
})