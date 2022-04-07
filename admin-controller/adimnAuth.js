const jwt = require("jsonwebtoken");
const expressJ = require("express-jwt");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const db = require("../models");
let generator = require("generate-password");
const { result } = require("lodash");
const { notify } = require("../router/auth.route");
const { notifyUser, errorHandler, sendData } = require("../_helper");
/**
 * admin auth
 */
const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
exports.adminSignup = async (req, res) => {
  try {
    const { firstName, lastName, sex, email, phoneNo, username, password } =
      req.body;
    const pass = await bcrypt.hash(password, 12);
    db.admin
      .create({
        firstName,
        lastName,
        email,
        username,
        sex,
        phoneNo,
        password: pass,
      })
      .then((admin) => {
        notifyUser("admin account registered successfully!", res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

exports.adminSignin = async (req, res) => {
  const { input, password } = req.body;
  try {
    const query = await db.admin.findOne({
      where: {
        [Op.or]: [{ email: input }, { username: input }],
      },
    });

    if (query) {
      const { dataValues } = query;
      const validPassword = await bcrypt.compare(password, dataValues.password);
      if (validPassword) {
        const token = jwt.sign(
          { id: dataValues.id },
          process.env.LOGIN_SECRET,
          { expiresIn: "6h" }
        );
        dataValues.code = undefined;
        dataValues.password = undefined;
        sendData({ user: { ...dataValues }, token }, res);
      } else {
        errorHandler("Password is incorrect!", res);
      }
    } else {
      errorHandler("admin with this username is not found", res);
    }
  } catch (err) {
    errorHandler(err, res);
  }
};
exports.adminforgotPassword = async (req, res) => {
  const { input } = req.body;
  try {
    const { dataValues } = await db.admin.findOne({
      where: {
        [Op.or]: [{ email: input }, { username: input }],
      },
    });
    if (dataValues) {
      let password = generator.generate({
        length: 8,
        numbers: true,
      });
      const pass = await bcrypt.hash(password, 12);
      let mailOptions = {
        from: process.env.GMAIL, // sender address
        to: dataValues.email, // list of receivers
        subject: "Forget password", // Subject line
        text: `Welcome, Use this password to login: ${password}`, // plain text body
        html: `<style>@import url('https://fonts.googleapis.com/css2?family=Cabin&display=swap');</style>
                        <div style="border: 1px solid rgba(244,151,3,.8); border-radius: 5px; padding: 30px;">&nbsp; &nbsp;&nbsp; &nbsp;
                        <div style="text-align: center; font-family: 'Cabin', sans-serif; margin: auto;">
                            <img style="display: block; margin-left: auto; margin-right: auto;" src="https://api.infoethiopia.net/images/logo.png" alt="" height="150">
                            <div style="color: #143d59; font-size: 14px; margin: 20px;">
                            <strong> 
                            <strong>
                                <span style=" letter-spacing: 4px;">THANKS FOR CHOOSING US!</span></strong>
                            
                            </strong>
                            </div>
                            <div style="margin: 0px 60px 20px; height: 0.2px; background-color: rgba(244,151,3,.8);">&nbsp;</div>
                            <div style="color: #143d59; font-size: 20px; margin: 20px 0px 30px;">Wellcome.</div>
                            <span style="color: #143d59;">  
                            <span style="font-size: 20px; ">Use this password to login: ${password}.</span>
                            </span>
                        </div>
                        </div>`,
      };
      const info = await transporter.sendMail(mailOptions);
      if (info.accepted.length > 0) {
        return db.admin
          .update(
            { password: pass },
            {
              where: {
                [Op.or]: [{ email: input }, { username: input }],
              },
            }
          )
          .then((user) => {
            notifyUser(`Your new password is sent to ${dataValues.email}. Check your email.`, res)
          })
          .catch((err) => {
            errorHandler(err, res)
          });
      } else {
        errorHandler("could not send the code to the email, Try again.", res);
      }
    } else {
      errorHandler("user  not found", res);
    }
  } catch (err) {
   errorHandler(err, res)
  }
};
exports.requireSignin = expressJ({
  secret: process.env.LOGIN_SECRET,
  algorithms: ["HS256"],
});

exports.signout = (req, res) => {
  res.clearCookie("token");
  notifyUser("Signout success!", res);
};
