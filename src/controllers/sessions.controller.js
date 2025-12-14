import jwt from 'jsonwebtoken';
import generateToken from '../utils/jwt.utils.js';
import { userRepository } from '../repositories/user.repository.js';
import mailerService from '../services/mailer.service.js';
import { isValidPassword } from '../utils/hash.utils.js';

export const login = async (req, res, next) => {
    if (!req.user) {
        return res.status(400).send({
            status: 'error',
            message: 'Credenciales inválidas'
        });
    }
    
    const token = generateToken(req.user); 
    
    res.cookie('coderCookieToken', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true
    }).send({
        status: 'success',
        message: 'Login exitoso',
        token
    });
};

export const current = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            status: 'error',
            message: 'No autenticado'
        });
    }
    
    try {
        const userDTO = await userRepository.getCurrentUser(req.user._id);

        if (!userDTO) {
            return res.status(404).send({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }
        
        res.send({
            status: 'success',
            payload: userDTO
        });
    } catch (error) {
        next(error);
    }
};

export const logout = (req, res, next) => {
    res.clearCookie('coderCookieToken').redirect('/login');
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    
    let recipientEmail = email;
    const MAIN_EMAIL = process.env.MAIL_USER;
    const ALIAS_EMAIL = process.env.MAIL_ALIAS;

    if (email === MAIN_EMAIL && ALIAS_EMAIL) {
        recipientEmail = ALIAS_EMAIL; 
        console.log(`[INFO] Redirigiendo correo de restablecimiento de ${email} a alias: ${recipientEmail}`);
    }
    
    try {
        const user = await userRepository.findByEmail(email);
        
        if (!user) {
            return res.status(200).send({
                status: 'success',
                message: 'Si el correo existe, se enviará un enlace de restablecimiento.'
            });
        }
        
        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const expirationTime = Date.now() + 3600000;
        
        await userRepository.saveResetToken(email, resetToken, expirationTime);
        
        const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        try {
            await mailerService.sendPasswordResetEmail(recipientEmail, resetLink);
            console.log(`Intento de envío exitoso del correo de restablecimiento para: ${recipientEmail}`);
        } catch (mailError) {
            console.error('ERROR CRÍTICO DE MAILING (SMTP/Auth/Conexión):', mailError.message);
        }
        
        res.send({
            status: 'success',
            message: 'Si el correo existe, se enviará un enlace de restablecimiento.'
        });
        
    } catch (error) {
        console.error("Error general en forgotPassword:", error);
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { newPassword } = req.body;
    
    try {
        const user = await userRepository.findByResetToken(token);
        
        if (!user) {
            return res.status(400).send({
                status: 'error',
                message: 'El enlace de restablecimiento es inválido o ha expirado.'
            });
        }
        
        if (isValidPassword(user, newPassword)) {
            return res.status(400).send({
                status: 'error',
                message: 'No puedes usar la misma contraseña anterior.'
            });
        }
        
        await userRepository.updatePassword(user.email, newPassword);
        
        res.send({
            status: 'success',
            message: 'Contraseña restablecida exitosamente.'
        });
        
    } catch (error) {
        console.error("Error en resetPassword:", error);
        next(error);
    }
};