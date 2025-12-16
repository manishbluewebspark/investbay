import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const {
  DB_URL,
  DB_DIALECT = 'postgres',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_SSL,
  DB_SSL_REJECT_UNAUTHORIZED,
  NODE_ENV,
} = process.env;

const logging = NODE_ENV === 'development' ? console.log : false;

let sequelize;

if (DB_URL) {
  sequelize = new Sequelize(DB_URL, {
    logging,
    dialect: 'postgres',
    dialectOptions: DB_SSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized:
              String(DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true',
          },
        }
      : undefined,
  });
} else {
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: Number(DB_PORT),
    dialect: DB_DIALECT,
    logging,
    dialectOptions: DB_SSL
      ? {
          ssl: {
            require: true,
            rejectUnauthorized:
              String(DB_SSL_REJECT_UNAUTHORIZED || 'false').toLowerCase() === 'true',
          },
        }
      : undefined,
  });
}

export { sequelize };

export async function initDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB ready');
  } catch (e) {
    console.error('DB error', e);
    process.exit(1);
  }
}
