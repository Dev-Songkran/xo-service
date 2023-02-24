import express from 'express';
import 'dotenv/config';
import route from './routes';
import session from 'express-session';

// init database
import './configs';

declare module "express-session" {
  interface SessionData {
    user: any
  }
}

const PORT = process.env.PORT || 3301;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'xo-cookie',
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  }
}));

app.use(route)

app.listen(PORT, () => console.log(`Run server on port http://localhost:${PORT}`));