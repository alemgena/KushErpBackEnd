const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { sendData, errorHandler } = require("../_helper");

/**
 *admin: registering trucks of delivey agent
 * @param {*} req
 * @param {*} res
 */
exports.registerdeliveryAgenttruck = async (req, res) => {
  try {
    let { id, truckDriverId } = req.params; //delivery agent id
    let { licencePlate, capacity } = req.body; //truck driver id: driver personnel
    await db.deliveryAgent
      .findOne({
        where: {
          id,
        },
      })
      .then(async (deliveryAgent) => {
        await db.truck
          .create({
            licencePlate,
            capacity,
            currentLocation: deliveryAgent.location, 
            deliveryAgentId: deliveryAgent.id,
          })
          .then(async (truck) => {
            db.user
              .findOne({
                where: { id: truckDriverId },
                attributes: { exclude: ["password", "code", "activate"] },
              })
              .then((user) => {
                return user.update({ truckId: truck.id });
              })
              .then((truckDriver) => {
                sendData({ truck: truck }, res);
              });
          })
          .catch((err) => {
            throw err
          });
      })
      .catch((err) => {
        throw err;
      });
  } catch (err) {
    throw err;
  }
};
/**
 * admin: update  delivery agent trucks
 * @param {re} req
 * @param {*} res
 */
exports.updatetruck = async (req, res) => {
  try {
    let { deliveryAgentId, truckId } = req.params;
    await db.deliveryAgent
      .findOne({
        where: {
          id: deliveryAgentId,
        },
      })
      .then(async (deliveryAgent) => {
        await db.truck
          .update(
            {
              ...req.body,
            },
            {
              where: {
                id: truckId,
              },
            }
          )
          .then((result) => {
            sendData(result, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: delete delivery agent truck
 */
exports.deletetruck = async (req, res) => {
  let { deliveryAgentId, truckId } = req.params;
  try {
    await db.deliveryAgentId
      .findOne({
        where: {
          id: deliveryAgentId,
        },
      })
      .then(async (deliveryAgent) => {
        await db.truck
          .findOne({
            id: truckId,
          })
          .then((truck) => {
            truck.destroy();
          })
          .then((result) => {
            sendData(result, res);
          });
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: list all trucks
 * @param {*} req
 * @param {*} res
 */
exports.listalltrucks = async (req, res) => {
  try {
    await db.truck
      .findAll({})
      .then((result) => {
        sendData(result, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

exports.listDeliveryAgenttrucks = async (req, res) => {
  let { deliveryAgentId } = req.params;
  try {
    await db.deliveryAgent
      .findOne({
        where: {
          id: deliveryAgentId,
        },
        include: [{ model: db.truck }],
      })
      .then((result) => {
        sendData(result, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch {
    errorHandler(err, res);
  }
};
