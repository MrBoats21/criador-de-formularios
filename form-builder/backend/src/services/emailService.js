const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
   user: process.env.EMAIL_USER,
   pass: process.env.EMAIL_PASSWORD
 }
});

const sendWelcomeEmail = async (email, password) => {
 const mailOptions = {
   from: process.env.EMAIL_USER,
   to: email,
   subject: 'Bem-vindo ao Sistema de Formulários',
   html: `
     <h1>Bem-vindo ao Sistema!</h1>
     <p>Sua conta foi criada com sucesso.</p>
     <p>Use suas credenciais para acessar:</p>
     <p><strong>Email:</strong> ${email}</p>
     <p><strong>Senha:</strong> ${password}</p>
     <p>Por favor, altere sua senha no primeiro acesso.</p>
   `
 };

 return transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
 const resetUrl = `http://localhost:5173/reset-password/${token}`;

 const mailOptions = {
   from: process.env.EMAIL_USER,
   to: email,
   subject: 'Recuperação de Senha',
   html: `
     <h1>Recuperação de Senha</h1>
     <p>Você solicitou a recuperação de senha.</p>
     <p>Clique no link abaixo para definir uma nova senha:</p>
     <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3B82F6; color: white; text-decoration: none; border-radius: 5px;">
       Redefinir Senha
     </a>
     <p>Este link é válido por 1 hora.</p>
     <p>Se você não solicitou esta recuperação, ignore este email.</p>
   `
 };

 return transporter.sendMail(mailOptions);
};

module.exports = {
 sendWelcomeEmail,
 sendPasswordResetEmail
};