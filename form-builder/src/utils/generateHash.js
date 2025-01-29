// generateHash.js
import bcrypt from 'bcryptjs';

const password = "123456";

bcrypt.hash(password, 10).then(hash => {
  console.log('Hash gerado:', hash);
  console.log('\nComando SQL completo:');
  console.log(`
    INSERT INTO users (name, email, password, role) VALUES 
    ('Admin User', 'admin@example.com', '${hash}', 'admin'),
    ('Normal User', 'user@example.com', '${hash}', 'user');
  `);
});