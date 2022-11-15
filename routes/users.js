const express = require("express");
const cors = require("cors");
const route = express.Router();
const app = express();
const { allowCrossDomain } = require("../utils/corsMiddleware");
const { userValidation } = require("../helpers/usersValidation");

const UsersController = require("../controllers/users");

app.use(allowCrossDomain);

route.post("/api/users/create", userValidation, UsersController.createUser);
route.get(
  "/api/users/getAllUsers",
  userValidation,
  UsersController.getAllUsers
);
route.get(
  "/api/users/getUserById/:userId",
  userValidation,
  UsersController.getUserById
);
route.delete(
  "/api/users/deleteUserrById/:userId",
  userValidation,
  UsersController.deleteUserById
);

route.patch(
  "/api/users/editUserById/:userId",
  userValidation,
  UsersController.updateUser
);
route.post("/api/users/login", UsersController.login);

module.exports = route;
