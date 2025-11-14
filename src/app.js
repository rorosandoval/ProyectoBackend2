import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/userRouter.js';
import sessionsRouter from './routes/sessionsRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(e => console.log(e));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongoUrl: process.env.MONGO_URI })
}));

initializePassport();
app.use(passport.initialize());

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', handlebars.engine({ 
    extname: '.handlebars',
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/users', userRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});