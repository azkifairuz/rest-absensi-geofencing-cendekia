const { Account } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { responseMessage, responseData } = require("../utils/responseHandle");


async function login(req, res) {
  try {
    const { username, password } = req.body;

    const user = await Account.findOne({ where: { username } });

    if (!user) {
      return responseMessage(res, 401, "username belum terdaftar");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return responseMessage(res, 401, "password salah");
    }

    const token = jwt.sign(
      { userId: user.id },
      "a40a47053167cb92bcb9b46ceff99ae2b734f758fbd565b1d70fb73ca2c16458",
      { expiresIn: "360d" }
    );
    await auth.update({ token }, { where: { id: user.id } });

    responseData(
      res,
      200,
      {
        token: token,
        id_user: user.id,
        username: user.username,
      },
      "Login successful"
    );
  } catch (error) {
    console.error(error);
    responseMessage(res, 500, "Internal server error");
  }
}

module.exports = {
  login,
};