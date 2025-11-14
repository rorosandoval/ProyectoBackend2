import passport from "passport";
import local from "passport-local";
import jwt from "passport-jwt";
import userModel from "../models/userModel.js";
import { createHash, isValidPassword } from "../utils.js";

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {
    
    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email',
            passwordField: 'password',
            session: false 
        },
        async (req, username, password, done) => {
            const { first_name, last_name, age } = req.body;
            
            try {
                const user = await userModel.findOne({ email: username });
                
                if (user) {
                    console.log('El usuario ya existe');
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                
                const newUser = {
                    first_name,
                    last_name,
                    email: username,
                    age,
                    password: createHash(password)
                };
                
                const result = await userModel.create(newUser);
                return done(null, result);
                
            } catch (error) {
                console.error('Error al crear usuario:', error);
                return done(error);
            }
        }
    ));
    
    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            session: false 
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                
                if (!user) {
                    console.log('Usuario no encontrado');
                    return done(null, false, { message: 'Usuario no encontrado' });
                }
                
                if (!isValidPassword(user, password)) {
                    console.log('Contraseña incorrecta');
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }
                
                return done(null, user);
                
            } catch (error) {
                return done(error);
            }
        }
    ));
    
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: 'coderSecret'
        },
        async (jwt_payload, done) => {
            try {
                return done(null, jwt_payload);
            } catch (error) {
                return done(error);
            }
        }
    ));
    
    passport.use('current', new JWTStrategy(
        {
            jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
            secretOrKey: 'coderSecret'
        },
        async (jwt_payload, done) => {
            try {
                const user = await userModel.findById(jwt_payload.user._id);
                
                if (!user) {
                    return done(null, false);
                }
                
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

export default initializePassport;