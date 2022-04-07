const jwt = require("jsonwebtoken");
const expressJ = require("express-jwt");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const nodemailer = require("nodemailer");
const db = require("../models");
let generator = require("generate-password");
const { result } = require("lodash");
const {
  errorHandler,
  sendData,
  notifyUser,
  omitNullValues,
  omitNullValuesObj,
} = require("../_helper");

/**
 *  user auth
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
exports.preSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      sex,
      email,
      phoneNo,
      username,
      password: pass,
    } = req.body;
    const user = db.user.findOne({
      where: {
        [Op.or]: [{ email: email || null }, { phoneNo: phoneNo || null }],
      },
    });
    if (user && user.activate === true) {
      return errorHandler("user already exists!", res);
    } else {
      if (user && user.activate == false) {
        user.destroy();
      }
      let code = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
      const password = await bcrypt.hash(password, 12);
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
              firstName,
              lastName,
              email,
              username,
              sex,
              phoneNo,
              code,
              password,
              pass,
            })
            .then((user) => {
              notifyUser(
                `Account activation link has been sent to ${email}. Link expires in 10min. `,
                res
              );
            })
            .catch((err) => {
              errorHandler(
                `Error creating the user email/username/phone no must be unique, try again ${err} `,
                res
              );
            });
        } else {
          errorHandler("Could not send the activation code, Try again!", res);
        }
      } catch (err) {
        errorHandler(err, res);
      }
    }
  } catch (err) {
    errorHandler(err, res);
  }
};
exports.signup = async (req, res) => {
  const { code, email } = req.body;
  console.log("email ", email);
  if (code) {
    const user = await db.user.findOne({
      where: {
        [Op.and]: [{ code }, { email }],
      },
    });
    if (user) {
      return user
        .update({
          code: null,
          activate: true,
        })
        .then((result) => {
          const token = jwt.sign(
            { id: result.Id },
            process.env.LOGIN_SECRET,
            {}
          );
          result.dataValues.profilePicture;
          result.dataValues.code = undefined;
          result.dataValues.password = undefined;
          return res.json({ user: { ...result.dataValues }, token });
        })
        .catch((err) => {
          return res.json({ err: `Error@signUp: ${err}` });
        });
    } else {
      return res.json({
        err: "Invalid/Expired activation code, Register again. ",
      });
    }
  } else {
    return res.json({
      err: "Something went wrong. Try again.",
    });
  }
};
exports.signin = async (req, res) => {
  try {
    let { input, password } = req.body;
    input = input.trim();
    // console.log("data: ", input);
    await db.user
      .findOne({
        where: {
          [Op.or]: [{ email: input }, { username: input }],
        },
      })
      .then(async (query) => {
        // sendData({user: query}, res)
        if (query) {
          const { dataValues } = query;

          if (dataValues.activate) {
            const validPassword = await bcrypt.compare(
              password,
              dataValues.password
            );
            if (validPassword) {
              // console.log('hey', dataValues)
              const token = jwt.sign(
                { id: dataValues.id },
                process.env.LOGIN_SECRET,
                { expiresIn: "6h" }
              );
              dataValues.code = undefined;
              dataValues.password = undefined;
              dataValues.activate = undefined;
              dataValues.pass = undefined
              let user = omitNullValues([dataValues]);
              sendData(
                {
                  user: {
                    ...omitNullValuesObj(dataValues),
                  },
                  token,
                },
                res
              );
            } else {
              errorHandler("Password is incorrect", res);
            }
          } else {
            errorHandler(
              "activate your account before attempting to sign in",
              res
            );
          }
        } else {
          notifyUser("user not found, register first prior to signIn!", res);
        }
      })
      .catch((err) => {});
  } catch (err) {
    errorHandler(err, res);
  }
};
exports.forgotPassword = async (req, res) => {
  const { input } = req.body;
  try {
    const { dataValues } = await db.user.findOne({
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
      const info = await transporter.sendMail(mailOptions).catch((err) => {
        res.json({
          sendEmail: `send email ${err}`,
        });
      });
      if (info.accepted.length > 0) {
        return db.user
          .update(
            { password: pass },
            {
              where: {
                [Op.or]: [{ email: input }, { username: input }],
              },
            }
          )
          .then((user) => {
            return res.json({
              message: `Your new password is sent to ${dataValues.email}. Check your email.`,
            });
          })
          .catch((err) => {
            return res.json({ err });
          });
      } else {
        return res.json({
          err: "could not send the code to the email, Try again.",
        });
      }
    } else {
      res.json({
        msg: `user with this ${input} is not found`,
      });
    }
  } catch (err) {
    return res.json({ err: `error@forgotPassword: ${err}` });
  }
};
exports.signout = (req, res) => {
  res.clearCookie("token");
  return res.json({
    msg: "Signout success!",
  });
};
