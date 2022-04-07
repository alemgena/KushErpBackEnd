const { result } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { errorHandler, sendData, notifyUser } = require("../_helper");
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.listnearbytrucks = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { capacity } = req.body;
    await db.ranch
      .findOne({
        where: {
          id: ranch.id,
        },
      })
      .then(async (ranch) => {
        await db.truck
          .findAll({
            where: {
              [Op.and]: [{ currentLocation: ranch.location }, { onduty: true }],
            },
          })
          .then((result) => {
            console.log("nearbytrucks: ", result);
            sendData({ nearbyTrucks: result }, res);
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.startDelivery = async (req, res) => {
  //responseId, deliveryTo, deliveryId
  let { dataValues: ranch } = req.ranch;
  let { truckId } = req.params;
  let { type, quantity } = req.body;
  try {
    await db.response
      .findOne({
        where: {
          response_ranch: ranch.id,
        },
        include: [{ model: db.request }],
      })
      .then(async (response) => {
        await db.delivery
          .create({
            type,
            quantity,
            responseId: response.id,
            deliveryTo: response.request.request_ranch,
            deliveryStatus: "pending",
          })
          .then(async (delivery) => {
            await db.truck
              .findOne({
                where: {
                  id: truckId,
                },
              })
              .then((truck) => {
                truck.update({ deliveryId: delivery.id }).then((result) => {
                  notifyUser("delivery process initated", res);
                });
              });
          });
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.deliveryLeftOff = async (req, res) => {
  try {
    let { deliveryId } = req.params;
    await db.delivery
      .findOne({
        where: {
          id: deliveryId,
        },
      })
      .then((delivery) => {
        delivery
          .update({
            deliveryStatus: "on progress",
          })
          .then(() => {
            notifyUser("delivery is on progress", res);
          })
          .catch((err) => {
            throw err;
          });
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

exports.ackdelivery = async (req, res) => {
  let { dataValues: ranch } = req.ranch;
  let { deliveryId } = req.params;
  try {
    await db.delivery
      .findOne({
        where: {
          id: deliveryId,
        },
        include: [{ model: db.ranch, where: { deliveryTo: ranch.id } }],
      })
      .then((delivery) => {
        return delivery.update({ deliveryStatus: "finished", delivered: true });
      })
      .then(async (result) => {
        await db.ranch
          .findOne({
            where: {
              id: ranch.id,
            },
          })
          .then(async (ranch) => {
            let liveStocks = await db.liveStock.findAll({
              where: {
                responseId: deliveryId.responseId,
              },
            });
            liveStocks.forEach((liveStock, i) => {
              liveStock.update({ localRanch: ranch.id });
            });
          })
          .then(async (truck) => {
            await db.truck.update({
              currentLocation: ranch.location,
            });
          });
      });
  } catch (err) {
    res.status(400).json({
      ackdeliveryErr: err,
    });
  }
};
