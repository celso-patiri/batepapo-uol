import { jestExpect as expect } from "@jest/expect";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { messageValidation } from "../messages.validator.js";
import { getMessages, addMessage } from "../messages.controller.js";

const DB_NAME = process.env.DB_NAME;
const URI = `${process.env.MONGO_URI}/${DB_NAME}`;

describe("messages controller tests", () => {
  const client = new MongoClient(URI);

  const req = {
    body: {},
    headers: { user: "" },
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

  const next = () => true;

  beforeAll(async () => {
    await client.connect();
    req.app.db = client.db(DB_NAME);
  });

  afterAll(async () => {
    await client.close();
  });

  const mockMessage = {
    to: "",
    text: "",
    type: "",
  };

  it("Should return 422 if 'to' field is invalid", async () => {
    req.body = mockMessage;
    const responseJson = await messageValidation(req, res);
    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toMatch(/'to' field cannot be empty/i);
  });

  it("Should return 422 if 'text' field is invalid", async () => {
    req.body = mockMessage;
    req.body.to = "test";
    const responseJson = await messageValidation(req, res);
    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toMatch(/'text' field cannot be empty/i);
  });

  it("Should return 422 if 'type' field is empty", async () => {
    req.body = mockMessage;
    req.body.to = "test";
    req.body.text = "test";
    const responseJson = await messageValidation(req, res);
    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toMatch(/"type" is not allowed to be empty/i);
  });

  it("Should return 422 if 'type' field doesn't not match message|private_message regex", async () => {
    req.body = mockMessage;
    req.body.to = "test";
    req.body.text = "test";
    req.body.type = "failedPattern";
    const responseJson = await messageValidation(req, res);
    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toMatch(
      /\"type\" with value \"failedPattern\" fails to match the required pattern/i
    );
  });
});
