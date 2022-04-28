import "dotenv/config";
import express from "express";
import messagesRouter from "./routes/messages/messages.routes.js";
import participantsRouter from "./routes/participants/participants.routes.js";

const app = express();
app.use(express.json());

app.use("/participants", participantsRouter);
app.use("/messages", messagesRouter);

export default app;
