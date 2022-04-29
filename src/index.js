import "dotenv/config";
import express from "express";
import { updateParticipantStatus } from "./controllers/participants/participants.controller.js";
import messagesRouter from "./routes/messages/messages.routes.js";
import participantsRouter from "./routes/participants/participants.routes.js";
import headerValidation from "./utils/headerValidation.js";

const MONGO_BASE_URI =
  process.env.NODE_ENV === "docker"
    ? process.env.MONGO_DOCKER_URI
    : process.env.MONGO_LOCAL_URI;

const MONGO_PORT = process.env.MONGO_PORT;
const DB_NAME = process.env.DB_NAME;
const MONGO_URI = `${MONGO_BASE_URI}:${MONGO_PORT}/${DB_NAME}`;

const app = express();
app.use(express.json());

app.MONGO_URI = MONGO_URI;

app.use("/participants", participantsRouter);
app.use("/messages", messagesRouter);
app.post("/status", headerValidation, updateParticipantStatus);

export default app;
