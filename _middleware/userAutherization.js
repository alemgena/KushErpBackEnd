const _ = require("lodash");
const db = require("../models");
const jwt = require("jsonwebtoken");
const expressJ = require("express-jwt");
const { notifyUser, errorHandler, sendData } = require("../_helper");
const { Op } = require("sequelize");
// const { notifyUser } = require("../_helper/notificationHandler");
// const { errorHandler, notifyUser } = require("../_helper");

exports.checkRecord = async (req, res, next) => {
  try {
    let { username } = req.body;
    let user = await db.user.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      next();
    } else {
      notifyUser("user already exists!", res);
    }
  } catch (err) {
    console.log("err: ", err);
    errorHandler(err, res);
  }
};
exports.requireSignin = expressJ({
  secret: process.env.LOGIN_SECRET,
  algorithms: ["HS256"],
});

exports.authMiddleware = (req, res, next) => {

  try {
    let authUserId = req.user.id;
    return db.user
      .findOne({ where: { id: authUserId } })
      .then((user) => {
        if (!(user === null)) {
          req.profile = user;
          next();
        } else {
          notifyUser("user does not exist! please signUp first", res);
        }
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res)
  }
};

exports.checkRanchManager = async (req, res, next) => {
  try {
    if(req.profile.role === "ranchManager"){
      await db.user.findOne({
        where:{
          id: req.profile.id
        },
        include:[{model: db.ranch}]
      })
      .then((result)=>{
        
        req.ranch = result.ranch
        next()
      })
    }
    else{
      errorHandler("invalid username/email", res)
    }
  } catch (error) {
    errorHandler(error, res)
  }
}
exports.checkInspector = async (req, res, next) => {
  try {
    if (req.profile.role === "inspector") {
      await db.user
        .findOne({
          where: {
            id: req.profile.id,
          },
          include: [{ model: db.govoffice }],
        })
        .then((result) => {
          req.govoffice = result.govoffice;
          next();
        });
    } else {
      errorHandler("invalid username/email", res);
    }
  } catch (error) {
    errorHandler(error, res);
  }
};