import express from "express";
import "dotenv/config";
import { MongoClient } from "mongodb";
import participantsRouter from "./routes/participants/participants.routes.js";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

const app = express();
app.use(express.json());

async function main() {
  const client = new MongoClient(URI);

  try {
    await client.connect();
    app.db = client.db(DB_NAME);
    console.log("Connected to mongodb");

    app.use("/participants", participantsRouter);
  } finally {
    await client.close();
  }
}

main().catch(console.dir);

app.listen(PORT, () => console.log("Listening on port " + PORT));
