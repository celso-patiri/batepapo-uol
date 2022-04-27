import { jestExpect as expect } from "@jest/expect";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { addParticipant } from "../../../controllers/participants/participants.controller.js";
import participantValidation from "../../../controllers/participants/participant.validator.js";

const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

describe("Participants router tests", () => {
  const client = new MongoClient(URI);

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
    expect(responseJson.message).toMatch(/name cannot be empty/i);
  });

  it("Should return error 409 if name is already taken", async () => {
    req.body.name = "teste";
    const responseJson = await addParticipant(req, res);
    expect(res.statusCode).toBe(409);
    expect(responseJson.message).toMatch(/already taken/i);
  });
});