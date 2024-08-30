import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

const sqlConfig: sql.config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST || 'localhost',  // Não inclua a instância se estiver usando uma porta dinâmica
    database: process.env.DB_NAME,
    options: {
      encrypt: false,              
      trustServerCertificate: true, // Certifique-se de que isso está correto conforme seu ambiente
    }
};

export const db = async () => {
  try {
    return await sql.connect(sqlConfig);
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Connection Details:', sqlConfig);
    throw new Error('Falha na conexão com o banco de dados.');
  }
};