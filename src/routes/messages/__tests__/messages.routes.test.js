import { jestExpect as expect } from "@jest/expect";
import app from "../../../index.js";
import { MongoClient, ObjectId } from "mongodb";
import crypto from "crypto";
import request from "supertest";

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = app.MONGO_URI;

const genRanHex = () => {
  return crypto.randomBytes(8).toString("hex").substring(0, 12);
};

describe("messages routes tests", () => {
  const client = new MongoClient(MONGO_URI);
  const appDb = client.db(DB_NAME);

  const mockMessage = {
    to: "test",
    text: "this message was sent from messages.routes.tests.js",
    type: "private_message",
  };

  beforeAll(async () => {
    await client.connect();
    app.db = appDb;
    await request(app)
      .post("/messages")
      .send(mockMessage)
      .set("User", "testUser");
  });

  afterAll(async () => {
    await client.close();
  });

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
      .expect(401)
      .then((res) => {
        const response = JSON.parse(res.text);
        expect(response.message).toMatch(/'user' header is required/i);
      });
  });

  describe("/messages route DELETE tests", () => {
    const randomId = genRanHex();
    const messages = appDb.collection("messages");

    beforeEach(async () => {
      await messages.insertOne({
        _id: new ObjectId(randomId),
        from: "testUser",
        ...mockMessage,
      });
    });

    afterEach(async () => {
      await messages.deleteOne({ _id: ObjectId(randomId) });
    });

    it("should return 401 if 'user' header is not provided ", async () => {
      await request(app)
        .delete(`/messages/${randomId}`)
        .expect(401)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/'user' header is required/i);
        });
    });

    it("should return 401 if message does not belong to user", async () => {
      await request(app)
        .delete(`/messages/${randomId}`)
        .set("User", "NotTestUser")
        .expect(401)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/does not own message/i);
        });
    });

    it("should return 404 if message does not exist", async () => {
      const wrongId = genRanHex();
      await request(app)
        .delete(`/messages/${wrongId}`)
        .set("User", "testUser")
        .expect(404)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/message not found in database/i);
        });
    });

    it("should return 200 if request is correct", async () => {
      await request(app)
        .delete(`/messages/${randomId}`)
        .set("User", "testUser")
        .expect(200)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/message deleted/i);
        });
    });
  });

  describe("/message route PUT tests", () => {
    const randomId = genRanHex();
    const messages = appDb.collection("messages");

    beforeEach(async () => {
      await messages.insertOne({
        _id: new ObjectId(randomId),
        from: "testUser",
        ...mockMessage,
      });
    });

    afterEach(async () => {
      await messages.deleteOne({ _id: ObjectId(randomId) });
    });

    it("should return 401 if 'user' header is not provided ", async () => {
      await request(app)
        .put(`/messages/${randomId}`)
        .send(mockMessage)
        .expect(401)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/'user' header is required/i);
        });
    });

    it("should return 401 if message does not belong to user", async () => {
      await request(app)
        .put(`/messages/${randomId}`)
        .send(mockMessage)
        .set("User", "NotTestUser")
        .expect(401)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/does not own message/i);
        });
    });

    it("should return 404 if message does not exist", async () => {
      const wrongId = genRanHex();
      await request(app)
        .put(`/messages/${wrongId}`)
        .send(mockMessage)
        .set("User", "testUser")
        .expect(404)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/message not found in database/i);
        });
    });

    it("should return 200 if request is correct", async () => {
      await request(app)
        .put(`/messages/${randomId}`)
        .send(mockMessage)
        .set("User", "testUser")
        .expect(200)
        .then((res) => {
          const response = JSON.parse(res.text);
          expect(response.message).toMatch(/message successfully updated/i);
        });
    });
  });
});
