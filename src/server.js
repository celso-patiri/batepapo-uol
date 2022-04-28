import { MongoClient } from "mongodb";
import app from "./index.js";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

const client = new MongoClient(URI);
client
  .connect()
  .then(() => {
    app.db = client.db(DB_NAME);
    console.log("Connected to mongodb");
  })
  .catch(console.dir);

app.listen(PORT, () => console.log("Listening on port " + PORT));
