import { jestExpect as expect } from "@jest/expect";
import "dotenv/config";
import { MongoClient } from "mongodb";
import app from "../../../index.js";
import participantValidation from "../participant.validator.js";
import { getParticipants } from "../participants.controller.js";

const DB_NAME = process.env.DB_NAME;
const MONGO_URI = app.MONGO_URI;

describe("Participants controller tests", () => {
  const client = new MongoClient(MONGO_URI);

  const req = {
    body: { name: "" },
    app: {
      db: null,
    },
  };

  const res = {
    statusCode: 0,
    status: function (code) {
      this.statusCode = code;
    },
    json: (obj) => obj,
  };

  beforeAll(async () => {
    await client.connect();
    req.app.db = client.db(DB_NAME);
  });

  afterAll(async () => {
    await client.close();
  });

  it("Should return error 422 if name is empty", async () => {
    const responseJson = await participantValidation(req, res, null);
    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toMatch(/'name' cannot be empty/i);
  });

  it("Should return an array from GET /participants", async () => {
    const responseJson = await getParticipants(req, res);
    expect(res.statusCode).toBe(200);
    expect(responseJson.data.participants).toBeInstanceOf(Array);
  });
});
