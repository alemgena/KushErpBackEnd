const _ = require("lodash");
const db = require("../models");
const jwt = require("jsonwebtoken");
const expressJ = require("express-jwt");
const { notifyUser, errorHandler, sendData } = require("../_helper");
const { Op } = require("sequelize");
// const { notifyUser } = require("../_helper/notificationHandler");
// const { errorHandler, notifyUser } = require("../_helper");
exports.preSignup = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      sex,
      email,
      phoneNo,
      username,
      password,
    } = req.body;
    const user = db.user.findOne({
      where: {
        [Op.or]: [{ email: email || null }, { phoneNo: phoneNo || null }],
      },
    });
    if (user && user.activate === true) {
      return res.json({ err: `user with ${email}/${phoneNo} already exists` });
    } else {
      if (user && user.activate == false) {
        user.destroy();
      }
      let code = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      const pass = await bcrypt.hash(password, 12);
      let mailOptions = {
        from: process.env.GMAIL, // sender address
        to: email, // list of receivers
        subject: "Account activation", // Subject line
        text: `Wellcome, This is the Activation code: ${code}`, // plain text body
        html: `<style>@import url('https://fonts.googleapis.com/css2?family=Cabin&display=swap');</style>
                <div style="border: 1px solid rgba(244,151,3,.8); border-radius: 5px; padding: 30px;">&nbsp; &nbsp;&nbsp; &nbsp;
                <div style="text-align: center; font-family: 'Cabin', sans-serif; margin: auto;">
                    <img style="display: block; margin-left: auto; margin-right: auto;" src="https://api.infoethiopia.net/images/logo.png" alt="" height="150">
                    <div style="color: #143d59; font-size: 14px; margin: 20px;">
                <strong>
                    <span style="letter-spacing: 4px;">THANKS FOR SIGNING UP!</span>
                </strong>
                </div>
                <div style="margin: 0px 60px 20px; height: 0.2px; background-color: rgba(244,151,3,.8);">&nbsp;</div>
                <div style="color: #143d59; font-size: 20px; margin: 20px 0px 30px;">Wellcome.</div>
                    <span style="color: #143d59;">
                    <span style="font-size: 20px;">This is your activation code: ${code}.</span>
                    </span>
                </div>
                </div>`,
      };
      try {
        const info = await transporter.sendMail(mailOptions);
        if (info.accepted.length > 0) {
          return db.user
            .create({
              firstName: firstName,
              middleName: middleName,
              lastName: lastName,
              email: email || "",
              username: username,
              sex: sex,
              phoneNo: phoneNo || "",
              code,
              password: pass,
            })
            .then((user) => {
              return res.json({
                message: `Account activation link has been sent to ${email}. Link expires in 10min. `,
              });
            })
            .catch((err) => {
              return res.json({
                err: `Error creating the user email/username/phone no must be unique, try again ${err} `,
              });
            });
        } else {
          return res.json({
            err: "Could not send the activation code, Try again. ",
          });
        }
      } catch (err) {
        console.log("sending email: ", err);
        res.json({
          sendemailErr: err,
        });
      }
    }
  } catch (err) {
    return res.json({ err: `error@preSignUp: ${err}` });
  }
};
exports.checkRecord = async (req, res, next) => {
  try {
    let { username } = req.body;
    let user = await db.admin.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      next();
    } else {
      errorHandler("user already exists!", res);
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
    return db.admin
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
    errorHandler(error, res);
  }
};
exports.checkAdmin = (req, res, next) => {
  if (req.profile.role === "admin") {
    next();
  } else {
    notifyUser("admin with this email/username not found!");
  }
};
