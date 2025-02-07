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
      <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          
          <h1 style="color: #1e40af; margin-bottom: 20px; text-align: center;">Bem-vindo ao Sistema!</h1>
          
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
            <p style="color: #1e293b; margin: 0;">Sua conta foi criada com sucesso.</p>
          </div>
 
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #0369a1; font-size: 18px; margin-bottom: 15px;">Suas Credenciais de Acesso</h2>
            <p style="margin-bottom: 10px;"><strong style="color: #0c4a6e;">Email:</strong> ${email}</p>
            <p style="margin-bottom: 10px;"><strong style="color: #0c4a6e;">Senha:</strong> ${password}</p>
          </div>
 
          <div style="background-color: #fff7ed; border-radius: 8px; padding: 20px;">
            <p style="color: #9a3412; margin: 0;">⚠️ Por favor, altere sua senha no primeiro acesso.</p>
          </div>
 
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      </div>
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
      <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="width: 80px; height: 80px; margin: 0 auto; background-color: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 40px;">🔒</span>
            </div>
          </div>
 
          <h1 style="color: #1e40af; margin-bottom: 20px; text-align: center;">Recuperação de Senha</h1>
 
          <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 20px;">
            <p style="color: #1e293b; margin: 0;">Recebemos sua solicitação de recuperação de senha.</p>
          </div>
 
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="display: inline-block; padding: 15px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease;">
              Redefinir Senha
            </a>
          </div>
 
          <div style="background-color: #fff7ed; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <p style="color: #9a3412; margin: 0;">⚠️ Este link é válido por 1 hora.</p>
          </div>
 
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px;">
            <p style="color: #0369a1; margin: 0;">
              Se você não solicitou esta recuperação, ignore este email.
            </p>
          </div>
 
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      </div>
    `
  };
 
  return transporter.sendMail(mailOptions);
 };

module.exports = {
 sendWelcomeEmail,
 sendPasswordResetEmail
};