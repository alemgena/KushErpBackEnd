const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { ranchManager } = require("../controllers");
const { errorHandler, notifyUser, sendData } = require("../_helper");
/**
 *admin: register user
 * @param {*} req
 * @param {*} res
 */

exports.registergovOffice = async (req, res) => {
  try {
    const { govOfficeName, govOfficePhoneNo, govOfficeEmail, location } =
      req.body;
    await db.govoffice
      .create({
        name: govOfficeName,
        phoneNo: govOfficePhoneNo,
        email: govOfficeEmail,
        location,
      })
      .then(async (govOffice) => {
        sendData({ govOffice: govOffice }, res);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: list all registered goverement offices
 * @param {*} req
 * @param {*} res
 */

exports.listallgovOffice = async (req, res) => {
  try {
    await db.govoffice
      .findAll({
        include: [{ model: db.user }],
        order: [["createdAt", "DESC"]],
      })
      .then((result) => {
        sendData({result: result}, res);
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: delete a goverment office
 * @param {*} req
 * @param {*} res
 */
exports.deletegovOffice = async (req, res) => {
  try {
    let { id } = req.params;
    await db.govoffice
      .findOne({
        where: {
          id,
        },
      })
      .then((govoffice) => {
        if (govoffice !== null) {
          govoffice.destroy();
          notifyUser("goverment office is deleted successfully!", res);
        } else {
          errorHandler("goverment office is not found!", res);
        }
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

/**
 * admin: update goverement office
 * @param {*} req
 * @param {*} res
 */
exports.updategovOffice = async (req, res) => {
  try {
    let { id } = req.body;
    await db.govoffice
      .findOne({
        where: {
          id,
        },
      })
      .then((govoffice) => {
        return govoffice.update(req.body);
      })
      .then((govoffice) => {
        sendData(govoffice, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
