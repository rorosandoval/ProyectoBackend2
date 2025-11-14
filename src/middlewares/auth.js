import passport from 'passport';

export const authenticateJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).send({ 
                status: 'error', 
                message: 'Error en la autenticación' 
            });
        }
        
        if (!user) {
            return res.status(401).send({ 
                status: 'error', 
                message: 'No autenticado' 
            });
        }
        
        req.user = user;
        next();
    })(req, res, next);
};

export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ 
                status: 'error', 
                message: 'No autenticado' 
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ 
                status: 'error', 
                message: 'No tienes permisos para acceder a este recurso' 
            });
        }
        
        next();
    };
};