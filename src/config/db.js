import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const { Pool, types } = require('pg')
import dotenv from 'dotenv'

dotenv.config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASS, DB_NAME, NODE_ENV } = process.env

types.setTypeParser(types.builtins.NUMERIC, (value) => parseFloat(value))

const config = {
  host: DB_HOST,
  port: parseInt(DB_PORT, 10),
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
}

// Solo agregar SSL si no es localhost
if (DB_HOST !== 'localhost') {
  config.ssl = { rejectUnauthorized: false }
}

export const DB = new Pool(config)

DB.connect()
  .then(() => {
    console.log(`Conectado a PostgreSQL en ${DB_HOST === 'localhost' ? 'local' : 'Render'}`)
  })
  .catch((err) => {
    console.error('Error conectando a la DB:', err)
  })