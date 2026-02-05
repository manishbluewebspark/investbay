import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

const {
  DB_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_SSL,
  DB_SSL_REJECT_UNAUTHORIZED,
  NODE_ENV,
} = process.env;

const ssl = DB_SSL
  ? {
      rejectUnauthorized:
        String(DB_SSL_REJECT_UNAUTHORIZED || "false").toLowerCase() === "true",
    }
  : false;

let pool;

if (DB_URL) {
  pool = new Pool({
    connectionString: DB_URL,
    ssl: ssl || false,
  });
} else {
  pool = new Pool({
    host: DB_HOST,
    port: Number(DB_PORT),
    database: DB_NAME,
    user: DB_USER,
    password: DB_PASS,
    ssl: ssl || false,
  });
}


export async function initDB() {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL DB connected ✅");
    client.release();
  } catch (err) {
    console.error("DB connection error ❌", err);
    process.exit(1);
  }
}

export { pool };
