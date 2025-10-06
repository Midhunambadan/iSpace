const User = require("../models/userModel");

const isLogin = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      userBlockLogout(req, res);
    } else {
      return res.redirect("/login");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user_id) {
      res.redirect("/home");
    }
    next();
  } catch (error) {
    console.log(error.message);
  }
};

const userBlockLogout = async (req, res, next) => {
  try {
    const userId = req.session.user_id;

    const user = await User.findById(userId);

    if (user.isActive == false) {
      req.session.destroy();
      res.redirect("/login");
    } else {
      next();
    }
  } catch (error) {
    console.log("error");
  }
};

module.exports = {
  isLogin,
  isLogout,
  userBlockLogout,
};
