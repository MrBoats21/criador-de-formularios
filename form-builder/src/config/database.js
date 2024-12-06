import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Marcola<2102',
  database: 'form_builder'
};

export const pool = mysql.createPool(dbConfig);