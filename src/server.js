import { MongoClient } from "mongodb";
import app from "./index.js";

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const MONGO_URI = app.MONGO_URI;

const client = new MongoClient(MONGO_URI);
client
  .connect()
  .then(() => {
    app.db = client.db(DB_NAME);
    console.log(`Connected to mongodb on ${MONGO_URI}`);
  })
  .catch(console.dir);

app.listen(PORT, () => {
  console.log(MONGO_URI);
  console.log("NODE_ENV: " + process.env.NODE_ENV);
  console.log("Listening on port " + PORT);
});
