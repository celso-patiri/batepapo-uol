import "dotenv/config";
import express from "express";
import { MongoClient } from "mongodb";

const port = process.env.PORT;
const uri = process.env.MONGO_URI;

const app = express();
app.use(express.json());

async function main() {
  const client = new MongoClient(uri);

  client
    .connect()
    .then(() => console.log("Connected to MongoDB"))
    .catch(console.error)
    .finally(() => client.close());
}

main();

app.listen(port, () => console.log("Listening on port " + port));
