const Joi = require("Joi");
const errorFunction = require("../utils/errorFunctions");

const patternPassword = /^[a-zA-Z0-9]{3,30}$/;
const patternPhoneNumber = /[0]{1}[0-9]{9}/;

const addUserSchema = Joi.object({
  username: Joi.string().min(5).max(30).required().trim(),
  password: Joi.string()
    .min(5)
    .max(100)
    .pattern(new RegExp(patternPassword))
    .required()
    .trim(),
  firstName: Joi.string().min(2).max(100).required().trim(),
  lastName: Joi.string().min(2).max(7).required().trim(),
  phone: Joi.string()
    .length(10)
    .pattern(RegExp(patternPhoneNumber))
    .required()
    .trim(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .trim(),
  address: Joi.string().min(10).max(100).allow("").trim(),
  avatar: Joi.string().allow("").trim(),
  isAdmin: Joi.boolean().required(),
});

const userValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    avatar: req.body.avatar,
    isAdmin: req.body.isAdmin,
  };

  const { error } = addUserSchema.validate(req.body);
  if (error) {
    res.status(406);
    return res.json(
      errorFunction(true, 406, `Error in User Data: ${error.message}`)
    );
  } else {
    next();
  }
};

module.exports = { userValidation };
