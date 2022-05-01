import { jestExpect as expect } from "@jest/expect";
import app from "../../../index.js";
import { MongoClient } from "mongodb";
import request from "supertest";

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = app.MONGO_URI;

describe("participants router tests", () => {
  const client = new MongoClient(MONGO_URI);

  beforeAll(async () => {
    await client.connect();
    app.db = client.db(DB_NAME);
    await request(app).post("/participants").send({ name: "test" });
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

  test("POST /status successfull", async () => {
    await request(app)
      .post("/status")
      .set("User", "test")
      .expect(200)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/status updated successfully/i);
      });
  });

  test("POST /status without header", async () => {
    await request(app)
      .post("/status")
      .set("User", "")
      .expect(401)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/'user' header is required/i);
      });
  });

  test("POST /status non existing user", async () => {
    await request(app)
      .post("/status")
      .set("User", Date.now().toString())
      .expect(404)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/participant not found on database/i);
      });
  });
});
