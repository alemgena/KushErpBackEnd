const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const {
  sendData,
  errorHandler,
  notifyUser,
  omitNullValues,
} = require("../_helper");

exports.registerRandomRanches = async (req, res, users) => {
  try {
    for (let i = 0; i < 10; i++) {
      // console.log("loop ", i)
      let name = `ranch-${Math.floor(
        10 + Math.random() * 9
      )}-${generator.generate({ length: 2, numbers: true })}`;
      let area = `${Math.floor(100 + Math.random() * 900)} sq m`;
      let distance = `${Math.floor(100 + Math.random() * 900)} KM`;
      let location = generator.generate();
      // console.log(`random: rench ${i}`, {name, area, distance, location})
      await db.ranch
        .create({
          name,
          area,
          location,
          distance,
        })
        .catch((err) => {
          console.log("err", err);
          res.status(400).json({
            regUserErr: err,
          });
        });
    }
    sendData("registering multiple ranches is successful", res);
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * register ranches
 * @param {*} req
 * @param {*} res
 */
exports.registerRanch = async (req, res) => {
  try {
    let { name, area, type, location, distance } = req.body; //assume name is unique for each ranch
    await db.ranch
      .create({
        name,
        type,
        area,
        location,
        distance,
      })
      .then((ranch) => {
        sendData({ ranch: ranch }, res);
      });
  } catch (err) {
    errorHandler("ranch already exists!", res);
  }
};
/**
 * list all ranch
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.listallRanch = async (req, res) => {
  try {
    await db.ranch
      .findAll({
        include: [
          {
            model: db.user,
            attributes: {
              exclude: [
                "password",
                "code",
                "activate",
                "govermentOffice",
                "truckId",
              ],
            },
          },
        ],
      })
      .then((ranches) => {
        ranches = omitNullValues(ranches);
        sendData({ ranches: ranches }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * update ranch
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.updateRanch = async (req, res) => {
  try {
    let { ranchname } = req.params;
    db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
      })
      .then((result) => {
        return result.update(req.body);
      })
      .then((updatedResult) => {
        sendData({ranch: updatedResult}, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: delete registered ranch
 * @param {*} req
 * @param {*} res
 */
exports.deleteRanch = async (req, res) => {
  try {
    let { ranchname } = req.params;
    await db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
      })
      .then((ranch) => {
        return ranch.destroy();
      })
      .then(() => {
        notifyUser("deletion was successful!", res);
      });
  } catch (err) {
    errorHandler("deletion was unsuccessful!", res);
  }
};
