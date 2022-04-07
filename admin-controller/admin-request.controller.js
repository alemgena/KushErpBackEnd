const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { sendData, errorHandler, notifyUser } = require("../_helper");
/**
 * admin: display all requests
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.viewCustomerLiveStockRequest = async (req, res) => {
  try {
    await db.request
      .findAll({
        include: [
          { model: db.order },
          { model: db.livestockrequest },
          { model: db.response },
        ],
        order: [["createdAt", "DESC"]],
      })
      .then((request) => {
        if (request !== null) {
          sendData({ result: request }, res);
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * admin: grant/ approve requests
 * @param {*} req
 * @param {*} res
 * @returns
 */
/**
 *
 * @param {*} req
 * @param {*} res
 *
 */
exports.grantRequest = async (req, res) => {
  let { request } = req.params;
  try {
    await db.request
      .update(
        {
          approved: true,
        },
        { where: { id: request } }
      )
      .then((approvedRequest) => {
        console.log(approvedRequest);
        notifyUser("customer request granted successfully!", res);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * admin: declines a request
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.declineRequest = async (req, res) => {
  return res.json({
    declineReq: await db.request.update({
      grant: false,
    }),
  });
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.deleteAllRequest = async (req, res) => {
  res.json({
    request: await db.request.destroy({ where: {} }),
  });
};

exports.deleteRequest = async (req, res) => {
  let { requestId } = req.params;
  try {
    await db.request
      .findOne({
        where: {
          id: requestId,
        },
      })
      .then((request) => {
        res.json({
          result: request.destroy(),
        });
      });
  } catch (err) {
    res.status(400).json({
      deleteRequestErr: err,
    });
  }
};
