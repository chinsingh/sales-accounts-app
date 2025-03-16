import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route";
import accountsRouter from "./routes/accounts.route";
import testRouter from "./routes/test.route";
import session from 'express-session';
import pg from 'connect-pg-simple';

dotenv.config();

const app = express();
app.use(express.json());

//cors
const allowedOrigins = process.env.FRONTEND_URL? [process.env.FRONTEND_URL] : [];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));


//session
const PostgresqlStore = pg(session);
const sessionStore = new PostgresqlStore({
  conString: process.env.DATABASE_URL,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "",
    resave: true,
    saveUninitialized: true,
    cookie: { 
      secure: false, 
      maxAge: 432000000 //5 days
    }, 
    store: sessionStore,
  })
);

//declaration merging required for using the user property
declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any } | null;
  }
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountsRouter);
app.use("/api/v1/test", testRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
