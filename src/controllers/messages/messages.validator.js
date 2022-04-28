import Joi from "joi";
import returnMessage from "../../utils/returnMessage.js";

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

const headerValidation = async (req, res, next) => {
  if (!req.headers.user) {
    res.status(422);
    return res.json(returnMessage(true, "'User' header is required"));
  }

  next();
};

const messageValidation = async (req, res, next) => {
  const payload = req.body;

  const { error } = messageSchema.validate(payload);
  if (error) {
    res.status(422);
    return res.json(returnMessage(true, error.details[0].message));
  }

  next();
};

export { headerValidation, messageValidation };
