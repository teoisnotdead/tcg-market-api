import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { Pool, types } = require('pg')
import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME } = process.env

types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))

export const DB = new Pool({
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  ssl: { rejectUnauthorized: false } // En local se comenta
})

DB.connect()
  .then(() => {
    console.log('Conectado a PostgreSQL en Render')
  })
  .catch((err) => {
    console.error('Error conectando a la DB:', err)
  })