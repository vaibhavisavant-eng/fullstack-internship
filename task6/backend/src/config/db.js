import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connection pool configuration for MySQL
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'fullstack_user_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const testDbConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database "fullstack_user_db" successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL Database Connection Warning:', error.message);
    return false;
  }
};

export default pool;
