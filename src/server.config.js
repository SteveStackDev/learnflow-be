import "dotenv/config";
import "#configs/passport.js";
import express from "express";
import bodyParser from "body-parser";
import rootRoute from "#routes.js";
import session from "express-session";
import passport from "passport";
import { RedisStore } from "connect-redis";
import { redisClient } from "#configs/redis.js";
import { createServer } from "http";
import { errorHandler } from "#middlewares/error.middleware.js";
import { ensureAuthSocket } from "#middlewares/ensureAuthSocket.middleware.js";
import { getIO } from "#configs/socketIO.js";

const app = express();
export const httpServer = createServer(app);
const PORT = process.env.PORT;

const connectServer = () => {
  const io = getIO();

  // Middlewares For Data Type From Client
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Express Session
  const sessionMiddleware = session({
    name: "LearnFlow",
    store: new RedisStore({
      client: redisClient,
    }),
    secret: `${process.env.EXPRESS_SESSION_SECRET_KEY}`,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: process.env.NODE_ENV === "PRODUCTION",
      maxAge: 24 * 60 * 60 * 1000,
    },
  });

  app.use(sessionMiddleware);

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // SocketIO Middlewares Setup
  io.engine.use(sessionMiddleware);
  io.engine.use(passport.initialize());
  io.engine.use(passport.session());

  io.use(ensureAuthSocket);

  // Middlewares For Using Router
  app.use("/api/v1", rootRoute);

  // Global Middleware For Errors
  app.use(errorHandler);

  httpServer.listen(PORT, () => {
    console.log("Server đang chạy ở cổng:", PORT);
  });
};

export default connectServer;
