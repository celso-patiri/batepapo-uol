import { jestExpect as expect } from "@jest/expect";
import app from "../../../index.js";
import { MongoClient } from "mongodb";
import request from "supertest";

const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

describe("participants router tests", () => {
  const client = new MongoClient(URI);

  beforeAll(async () => {
    await client.connect();
    app.db = client.db(DB_NAME);
  });

  afterAll(async () => {
    await client.close();
  });

  test("GET /participants", async () => {
    await request(app)
      .get("/participants")
      .expect(200)
      .then((res) => {
        expect(Array.isArray(res.body.data.participants)).toBeTruthy();
      });
  });

  test("POST /participants", async () => {
    const name = Date.now().toString();
    await request(app)
      .post("/participants")
      .send({ name })
      .expect(201)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/added/i);
      });
  });
});