import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT),
    secure: process.env.MAIL_SECURE === 'true',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('ERROR DE CONEXIÓN SMTP:', error.message);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});

class MailerService {
    async sendMail(to, subject, htmlContent) {
        try {
            const sender = process.env.MAIL_ALIAS || process.env.MAIL_USER;
            await transporter.sendMail({
                from: `"Servicio de Soporte" <${sender}>`,
                to,
                subject,
                html: htmlContent
            });
            return true;
        } catch (error) {
            console.error('ERROR AL ENVIAR CORREO:', error.message);
            throw error; 
        }
    }

    async sendPasswordResetEmail(userEmail, resetLink) {
        const subject = "Restablecimiento de Contraseña";
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <div style="background-color: #f7f7f7; padding: 20px; text-align: center;">
                    <h1 style="color: #333;">Recuperación de Contraseña</h1>
                </div>
                <div style="padding: 20px; text-align: center;">
                    <p style="font-size: 16px; color: #555;">
                        Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva.
                    </p>
                    <p style="margin: 30px 0;">
                        <a href="${resetLink}" 
                           style="padding: 12px 25px; 
                                  background-color: #007bff; 
                                  color: white; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  font-weight: bold; 
                                  display: inline-block;">
                            Restablecer Contraseña
                        </a>
                    </p>
                    <p style="font-size: 14px; color: #888;">
                        Este enlace es válido por 1 hora. Si no solicitaste esto, ignora este correo.
                    </p>
                </div>
            </div>
        `;
        
        return this.sendMail(userEmail, subject, html);
    }

    async sendPurchaseConfirmation(userEmail, ticket, purchasedProducts) {
        const subject = "Confirmación de Compra - Ticket #" + ticket.code;
        
        const productList = purchasedProducts.map(item => `
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.product}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>
        `).join('');
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                <div style="background-color: #4CAF50; padding: 20px; color: white; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu compra! 🎉</h1>
                </div>
                
                <div style="padding: 20px;">
                    <p style="font-size: 16px; color: #333;">Tu pedido ha sido procesado con éxito.</p>
                    
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #4CAF50; margin-top: 0; font-size: 18px;">Resumen del Pedido</h2>
                        <p style="margin: 5px 0;"><strong>Código de Ticket:</strong> ${ticket.code}</p>
                        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
                        <hr style="border: none; border-top: 1px dashed #ddd; margin: 10px 0;">
                        <p style="margin: 5px 0; font-size: 18px; font-weight: bold;">Total Pagado: <span style="color: #d9534f;">$${ticket.amount.toFixed(2)}</span></p>
                    </div>

                    <h3>Detalles de Productos:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f1f1f1;">
                                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Producto (ID)</th>
                                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Cantidad</th>
                                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Precio Unitario</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${productList}
                        </tbody>
                    </table>
                </div>
                
                <div style="background-color: #f7f7f7; padding: 15px; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                    <p style="color: #666; font-size: 14px;">Si tienes alguna pregunta, responde a este correo. ¡Gracias!</p>
                </div>
            </div>
        `;
        
        return this.sendMail(userEmail, subject, html);
    }
}

export default new MailerService();