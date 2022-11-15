const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorFunction = require("../utils/errorFunctions");
const securePassword = require("../utils/securePassword");

const createUser = async (req, res, next) => {
  try {
    const existingEmail = await Users.findOne({
      email: req.body.email,
    }).lean(true);

    const existingUsername = await Users.findOne({
      username: req.body.username,
    }).lean(true);

    if (existingEmail || existingUsername) {
      res.status(403);
      return res.json(errorFunction(true, 403, "User or Email Already Exits"));
    } else {
      const hashedPassword = await securePassword(req.body.password);

      const newUser = await Users.create({
        username: req.body.username,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        addRess: req.body.addRess,
        email: req.body.email,
        avatar: req.body.avatar,
        isAdmin: req.body.isAdmin,
      });
      if (newUser) {
        res.status(201);
        return res.json(errorFunction(false, 201, "User Created", newUser));
      } else {
        res.status(403);
        return res.json(errorFunction(true, 403, "Error Creating User"));
      }
    }
  } catch (error) {
    console.log(" ERR", error);
    res.status(400);
    return res.json(errorFunction(true, 400, "Error Adding User"));
  }
};

const login = (req, res, next) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    // username = 'admin'
    Users.findOne({ username: username }).then(
      // Users.findOne({ $or: [{ email: username }, { phone: username }] }).then(
      (user) => {
        if (user) {
          bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
              res.json(errorFunction(true, 400, "Bad Request"));
            }
            if (result) {
              let access_token = jwt.sign(
                {
                  name: user.username,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  isAdmin: user.isAdmin,
                },
                "secretValue",
                {
                  expiresIn: "1h",
                }
              );
              res.json({
                message: "Login Successfully!",
                access_token,
                userId: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
                phone: user.phone,
                address: user.address,
                avatar: user.avatar,
              });
            } else {
              res.json(errorFunction(true, 400, "Password does not matched!"));
            }
          });
        } else {
          res.json(errorFunction(true, 400, "No user found!"));
        }
      }
    );
  } catch (error) {
    res.json(errorFunction(true, 400, "Bad Request"));
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await Users.find();
    if (Users.length > 0) {
      res.status(200).json({
        Users: allUsers.reverse(),
      });
    } else {
      res.status(200).json({
        message: "no results",
        Users: [],
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Bab request",
    });
  }
};

const getUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findById(userId);
    if (user) {
      res.status(200).json({
        statuscode: 200,
        user,
      });
    } else {
      res.json({
        statuscode: 204,
        message: "this user Id is have not in the database",
        user: {},
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

const deleteUserById = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const user = await Users.findByIdAndRemove(userId);

    if (user) {
      res.status(200).json({
        statuscode: 200,
        message: "Delete user successfully",
      });
    } else {
      res.json({
        statuscode: 204,
        message: "This user Id is have not in the database",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

const updateUser = (req, res, next) => {
  try {
    const userId = req.params.userId;
    const isBodyEmpTy = Object.keys(req.body).length;
    if (isBodyEmpTy === 0) {
      return res.send({
        statuscode: 403,
        message: "Body request can not emty.",
      });
    }
    Users.findByIdAndUpdate(userId, req.body).then((data) => {
      if (data) {
        res.status(200).json({
          statuscode: 200,
          message: "Update user successfully",
        });
      } else {
        res.json({
          statuscode: 204,
          message: "This user Id is have not in the database ",
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      statuscode: 400,
      message: "Bad request",
    });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUser,
  login,
};
