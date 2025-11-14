import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', passport.authenticate('register', { 
    session: false,
    failureRedirect: '/api/sessions/failregister' 
}), async (req, res) => {
    res.status(201).send({ 
        status: 'success', 
        message: 'Usuario registrado correctamente' 
    });
});

router.get('/failregister', (req, res) => {
    res.status(400).send({ 
        status: 'error', 
        message: 'Error al registrar el usuario' 
    });
});

router.post('/login', passport.authenticate('login', { 
    session: false,
    failureRedirect: '/api/sessions/faillogin' 
}), async (req, res) => {
    
    if (!req.user) {
        return res.status(400).send({ 
            status: 'error', 
            message: 'Credenciales inválidas' 
        });
    }
    
    const token = jwt.sign(
        { 
            user: {
                _id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
        }, 
        'coderSecret', 
        { expiresIn: '24h' }
    );
    
    res.cookie('coderCookieToken', token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true
    }).send({ 
        status: 'success', 
        message: 'Login exitoso',
        token 
    });
});

router.get('/faillogin', (req, res) => {
    res.status(401).send({ 
        status: 'error', 
        message: 'Error en el login' 
    });
});

router.get('/current', passport.authenticate('current', { 
    session: false 
}), (req, res) => {
    
    if (!req.user) {
        return res.status(401).send({ 
            status: 'error', 
            message: 'No autenticado' 
        });
    }
    
    const userDTO = {
        _id: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role,
        cart: req.user.cart
    };
    
    res.send({ 
        status: 'success', 
        payload: userDTO 
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login');
})

export default router;