import joi from "joi";
import responseData from "../../utils/responseData.js";

const participantSchema = joi.object({
  name: joi.string().min(1).required().messages({
    "string.empty": "'name' cannot be empty",
    "any.required": "'name' is a required field",
  }),
});

const participantValidation = async (req, res, next) => {
  const payload = req.body;

  const { error } = participantSchema.validate(payload);
  if (error) {
    res.status(422);
    return res.json(responseData(true, error.details[0].message));
  }

  next();
};

export default participantValidation;
