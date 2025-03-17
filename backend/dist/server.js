import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import accountsRouter from "./routes/accounts.route.js";
import testRouter from "./routes/test.route.js";
import session from 'express-session';
import pg from 'connect-pg-simple';
dotenv.config();
const app = express();
//cors
// const allowedOrigins = process.env.FRONTEND_URL? [process.env.FRONTEND_URL] : [];
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
};
app.use(cors(corsOptions));
app.set('trust proxy', true);
app.use(express.json());
//session
const PostgresqlStore = pg(session);
const sessionStore = new PostgresqlStore({
    conString: process.env.DATABASE_URL,
});
app.use(session({
    secret: process.env.SESSION_SECRET ?? "",
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false,
        maxAge: 432000000 //5 days
    },
    store: sessionStore,
}));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountsRouter);
app.use("/api/v1/test", testRouter);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map