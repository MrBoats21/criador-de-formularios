const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendWelcomeEmail = async (userEmail, temporaryPassword) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'Bem-vindo ao Sistema de Formulários',
    html: `
      <h1>Bem-vindo ao Sistema!</h1>
      <p>Sua conta foi criada com sucesso.</p>
      <p>Use suas credenciais para acessar:</p>
      <p>Email: ${userEmail}</p>
      <p>Senha temporária: ${temporaryPassword}</p>
      <p>Por favor, altere sua senha no primeiro acesso.</p>
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendWelcomeEmail
};