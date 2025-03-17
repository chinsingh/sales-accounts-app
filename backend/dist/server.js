import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import accountsRouter from "./routes/accounts.route.js";
import testRouter from "./routes/test.route.js";
import session from 'express-session';
import pg from 'connect-pg-simple';
import { rateLimit } from "express-rate-limit";
dotenv.config();
const app = express();
//cors
const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"]
};
app.use(cors(corsOptions));
app.use(express.json());
app.set("trust proxy", true);
//since the service is behind a proxy, this constitutes a global rate limiting to prevent salesforce API limit from breaching
//even though the rate limit is imposed on a per IP basis - in this case it will be IP of the proxy making it global
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: parseInt(process.env.API_LIMIT ?? '100'), // default 100
    standardHeaders: "draft-8",
    legacyHeaders: false,
});
app.use(limiter);
//session
const PostgresqlStore = pg(session);
const sessionStore = new PostgresqlStore({
    conString: process.env.DATABASE_URL,
});
app.use(session({
    secret: process.env.SESSION_SECRET ?? "",
    name: "sessionId", //generic name to avoid fingerprinting
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        maxAge: 432000000, //5 days
    },
    store: sessionStore,
}));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/accounts", accountsRouter);
app.use("/api/v1/test", testRouter);
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map