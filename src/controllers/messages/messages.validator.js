import Joi from "joi";
import { ObjectId } from "mongodb";
import { stripHtml } from "string-strip-html";
import responseData from "../../utils/responseData.js";

const messageSchema = Joi.object({
  to: Joi.string().min(1).required().messages({
    "string.empty": "'to' field cannot be empty",
    "any.required": "'to' is a required field",
  }),
  text: Joi.string().min(1).required().messages({
    "string.empty": "'text' field cannot be empty",
    "any.required": "'text' is a required field",
  }),
  type: Joi.string()
    .pattern(/private_message$|message$/)
    .required()
    .messages({ "any.required": "'type' is a required field" }),
});

const validateMessage = async (req, res, next) => {
  const payload = req.body;

  const { error } = messageSchema.validate(payload);
  if (error) {
    res.status(422);
    return res.json(responseData(true, error.details[0].message));
  }

  next();
};

const validadeMessageExistence = async (req, res, next) => {
  const messages = req.app.db.collection("messages");
  const messageId = stripHtml(req.params.messageId).result.trim();
  const user = stripHtml(req.headers.user).result.trim();

  const existingMessage = await messages.findOne({
    _id: ObjectId(messageId),
  });

  if (!existingMessage) {
    res.status(404);
    return res.json(responseData(true, "Message not found in database"));
  }

  if (existingMessage.from !== user) {
    res.status(401);
    return res.json(
      responseData(true, `User ${user} does not own message ${messageId}`)
    );
  }
  next();
};

export { validateMessage, validadeMessageExistence };
