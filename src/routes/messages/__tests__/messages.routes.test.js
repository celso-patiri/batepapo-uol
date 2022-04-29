import { jestExpect as expect } from "@jest/expect";
import app from "../../../index.js";
import { MongoClient } from "mongodb";
import request from "supertest";

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = app.MONGO_URI;

describe("messages routes tests", () => {
  const client = new MongoClient(MONGO_URI);

  beforeAll(async () => {
    await client.connect();
    app.db = client.db(DB_NAME);
  });

  afterAll(async () => {
    await client.close();
  });

  const mockMessage = {
    to: "test",
    text: "this message was sent from messages.routes.tests.js",
    type: "private_message",
  };

  test("POST /messages", async () => {
    await request(app)
      .post("/messages")
      .send(mockMessage)
      .set("User", "testUser")
      .expect(201)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/message successfully added/i);
      });
  });

  test("GET /messages with no limit", async () => {
    await request(app)
      .get("/messages")
      .set("User", "testUser")
      .expect(200)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/messages successfully retrieved/i);
      });
  });

  test("GET /messages with limit", async () => {
    const limit = 5;
    await request(app)
      .get(`/messages?limit=${limit}`)
      .set("User", "testUser")
      .expect(200)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/messages successfully retrieved/i);
        expect(Array.isArray(response.data.messages)).toBeTruthy();
        expect(response.data.messages.length).toBeLessThanOrEqual(limit);
      });
  });

  test("GET /messages without header", async () => {
    await request(app)
      .get("/messages")
      .set("User", "")
      .expect(422)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/'user' header is required/i);
      });
  });
});
