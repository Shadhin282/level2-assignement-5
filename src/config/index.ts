import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt: {
    access_secret: process.env.JWT_ACCESS_SECRET || 'access-secret-key',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret-key',
    access_expire: process.env.JWT_ACCESS_EXPIRE || '15m',
    refresh_expire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  node_env: process.env.NODE_ENV || 'development',
};
