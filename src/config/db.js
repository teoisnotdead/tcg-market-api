import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Pool } = require('pg')
import dotenv from 'dotenv'

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

export const DB = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
})