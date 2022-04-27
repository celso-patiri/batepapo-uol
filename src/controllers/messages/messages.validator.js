import Joi from "joi";
import returnMessage from "../../utils/returnMessage.js";

const message = Joi.object({
  to: Joi.string().min(1).required(),
  text: Joi.string().min(1).required(),
  type: Joi.regex(/private_message$|message$/).required(),
});

const messageValidation = async (req, res, next) => {
  const payload = req.body;

  const { error } = message.validate(payload);
  if (error) {
    res.status(422);
    return res.json(returnMessage(true, "One or more invalid fields in body"));
  }

  next();
};

export default messageValidation;
