import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";
import messagesRouter from "./routes/messages/messages.routes.js";
import participantsRouter from "./routes/participants/participants.routes.js";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

const app = express();
app.use(express.json());

async function main() {
  const client = new MongoClient(URI);

  await client.connect();
  await client.db(DB_NAME).command({ ping: 1 });

  app.db = client.db(DB_NAME);
  console.log("Connected to mongodb");

  app.use("/participants", participantsRouter);
  app.use("/messages", messagesRouter);
}

main().catch(console.dir);

app.listen(PORT, () => console.log("Listening on port " + PORT));
