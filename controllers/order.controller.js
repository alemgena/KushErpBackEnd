const { result, castArray, parseInt } = require("lodash");
const request = require("request");
const { sequelize } = require("../models");
const db = require("../models");
const {
  sendData,
  errorHandler,
  notifyUser,
  notifyUserSucc,
} = require("../_helper");
const { Op } = require("sequelize");
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.preorder = async (req, res, next) => {
  try {
    let { productId } = req.params;
    let {
      name: firstName,
      lastName,
      email,
      phone: phoneNo,
      date: orderDate,
      size,
    } = req.body;
    let {
      origin,
      delivery_method,
      destination,
      quantity,
      currency,
      totalPrice,
    } = req.body.orders[0];
    // console.log("productId", productId);
    request(
      `https://api.kushlivestock.com/product/getProduct/${productId}`,
      async (error, response, body) => {
        if (!error && response.statusCode == 200) {
          // console.log("body ", JSON.parse(body));
          let products = JSON.parse(body);
          let {
            Name: liveStockType,
            breadType: breed,
            orgin: origin,
            weight,
            age,
          } = products;

          let requirements = {
            liveStockType,
            breed,
            origin,
            weight,
            age,
          };

          await db.order
            .create({
              firstName,
              lastName,
              email,
              phoneNo,
              orderDate,
              origin,
              delivery_method,
              destination,
              quantity,
              currency,
              totalPrice,
              productId,
            })
            .then((order) => {
              req.order = { order: order, quantity, requirements };
              next();
            });
        } else {
          console.log(error);
          throw error;
        }
      }
    );
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} type
 */
exports.livestockOrder = async (req, res) => {
  try {
    let { order, quantity, requirements } = req.order;
    let { liveStockType, breed, origin, weight, age } = requirements;
    console.log("requirements", breed, origin);
    //look for the ranch
    await db.ranch
      .findOne({
        where: {
          type: "Main Ranch",
        },
      })
      .then(async (ranch) => {
        if (ranch !== null) {
          //create the request
          await db.request
            .create({
              type: liveStockType,
              ranchname: ranch.name, //main ranch name
              request_ranch: ranch.id, //main ranch id
              orderId: order.id,
            })
            .then(async (request) => {
              //specify the requirements
              return await db.livestockrequest
                .create({
                  type: liveStockType,
                  quantity,
                  breed,
                  origin,
                  weight,
                  age,
                  livestock_request: request.id,
                })
                .then(async (result) => {
                  console.log("result ", result);
                  //short list ranches in accordance with the requirements
                  await db.ranch
                    .findAll({
                      where: {
                        [Op.not]: [{ type: "Main Ranch" }],
                      },
                      include: [
                        {
                          model: db.liveStock,
                          where: {
                            [Op.or]: [
                              { breed: breed},
                              { origin: origin },
                            ],
                          },
                        },
                      ],
                    })
                    .then(async (shortlistedRanch) => {
                      console.log("shortlistedRanch: ", shortlistedRanch);
                      shortlistedRanch.forEach(async (candidate_ranch) => {
                        await db.response.create({
                          requestId: request.id,
                          request_ranchname: ranch.name, //main ranch name
                          response_ranchname: candidate_ranch.name,
                          response_ranch: candidate_ranch.id,
                        });
                      });
                      notifyUserSucc("", res);
                    })
                    .catch((err) => {
                      throw err;
                    });
                })
                .catch((err) => {
                  throw err;
                });
            })
            .catch((err) => {
              throw err;
            });
        } else {
          throw new Error("main ranch does not exists!");
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};
