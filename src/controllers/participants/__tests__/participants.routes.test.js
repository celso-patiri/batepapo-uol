import { jestExpect as expect } from "@jest/expect";
import { addParticipant } from "../participants.controller.js";
import participantValidation from "../participant.validator.js";

const req = { body: { name: "" } };

const res = {
  statusCode: 0,
  status: function (code) {
    this.statusCode = code;
  },
  json: (obj) => obj,
};

describe("Participant validator tests", () => {
  it("Should return error 422 if name is empty", async () => {
    const responseJson = await participantValidation(req, res, null);

    expect(res.statusCode).toBe(422);
    expect(responseJson.message).toBe("Name cannot be empty");
  });
});
