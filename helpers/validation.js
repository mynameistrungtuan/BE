const Joi = require("Joi");

const patternPassword = /^[a-zA-Z0-9]{3,30}$/;
const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const checkAddProduct = Joi.object({
  productName: Joi.string().min(5).max(100).required(),
  productBrand: Joi.string().required(),
  type: Joi.string().required(),
  info: Joi.string(),
  price: Joi.number().required(),
  discount: Joi.number(),
  quantity: Joi.number().required(),
  images: Joi.array().items(Joi.string().required()),
});

const addUserSchema = Joi.object({
  userName: Joi.string().min(5).max(30).required(),
  password: Joi.string()
    .min(5) 
    .max(100)
    .pattern(new RegExp(patternPassword))
    .required(),
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(7).required(),
  phone: Joi.string().max(10).required(),
  email: Joi.string().pattern(new RegExp(patternEmail)).allow(""),
  // email: Joi.string().email({ tlds: { allow: false } }),
  address: Joi.string().min(10).max(100).allow(""),
  avatar: Joi.string().allow(""),
});

module.exports = { checkAddProduct, addUserSchema };
