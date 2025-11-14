import { Router } from 'express';
import passport from 'passport';

const router = Router();

router.get('/', (req, res) => {
    res.redirect('/login');
});

router.get('/register', (req, res) => {
    res.render('register', { title: 'Registro' });
});

router.get('/login', (req, res) => {
    res.render('login', { title: 'Iniciar sesión' });
});

router.get('/home', passport.authenticate('jwt', { 
    session: false,
    failureRedirect: '/login'
}), async (req, res) => {
    try {
        const userData = req.user.user || req.user;
        
        res.render('home', { 
            title: 'Inicio',
            user: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                age: userData.age,
                role: userData.role
            }
        });
    } catch (error) {
        res.redirect('/login');
    }
});

export default router;