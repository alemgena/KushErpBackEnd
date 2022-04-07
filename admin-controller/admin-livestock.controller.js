const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
let shortId = require("shortid");
const db = require("../models");
const { sendData, errorHandler } = require("../_helper");
const assign_random_value = (value) => {
  const random = Math.floor(Math.random() * value.length);
  return value[random];
};
/** register random ranches for test use only: below */
exports.registerRandomLiveStocks = async (req, res) => {
  try {
    await db.ranch.findAll({}).then((ranches) => {
      ranches.forEach(async (ranch) => {
        for (let i = 0; i < 10; i++) {
          let firstName = `liveStockSupplier-${Math.floor(
            10 + Math.random() * 9
          )}`;
          let lastName = `user-${Math.floor(10 + Math.random() * 9)}`;
          let sex = assign_random_value(["male", "female"]);
          let address = generator.generate({ length: 3, numbers: true });
          let phoneNo = `${Math.floor(100000000 + Math.random() * 900000000)}`;
          let quantity = Math.floor(10 + Math.random() * 90);
          let username = shortId();
          // console.log(`loop ${i} `, username);
          await db.livestockSupplier
            .create({
              firstName,
              lastName,
              address,
              phoneNo,
              username,
              quantity,
              sex,
              location: ranch.location,
              localRanch: ranch.id,
            })
            .then(async (result) => {
              for (let i = 0; i < quantity; i++) {
                let type = assign_random_value(
                  ["cattle"],
                  ["cammel"],
                  ["sheep"],
                  ["goat"]
                );
                let sex = assign_random_value(["male", "female"]);
                let breed = assign_random_value([
                  "breed-01",
                  "breed-02",
                  "breed-03",
                  "breed-04",
                ]);
                let residential = assign_random_value([
                  "on ranch",
                  "off ranch",
                ]);
                let weight = `${Math.floor(100 + Math.random() * 900)} KG`;
                let age = `${Math.floor(10 + Math.random() * 9)}`;
                try {
                  await db.liveStock
                    .create({
                      type,
                      sex,
                      breed,
                      weight,
                      age,
                      residential,
                      livestocksupplier: result.id,
                      localRanch: ranch.id,
                    })
                    .catch((err) => {
                      res.status(400).json({
                        err: `registering smallholder livestocks: ${err}`,
                      });
                    });
                } catch (err) {
                  res.json({
                    err: `ranch manager couldn't register local live stock : ${err}`,
                  });
                }
              }
            });
        }
        console.log("\n");
      });
      res.status(200).json({
        registerRandomLiveStocks: "success",
      });
    });
  } catch (err) {
    res.json({
      err: "",
    });
  }
};
/** /** register random ranches for test use only: above */
/**
 * admin: register livestock supplier and livestocks
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.registerlivestockSupplier = async (req, res) => {
  try {
    let { ranchname } = req.params;
    let { firstName, lastName, address, phoneNo, location, sex } = req.body; //assume name is unique for each ranch} = req.body
    await db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
      })
      .then(async (ranch) => {
        return await db.livestockSupplier
          .create({
            firstName,
            middleName,
            lastName,
            location,
            address,
            phoneNo,
            qunatity,
            sex,
            localRanch: ranch.id,
          })
          .then(async (result) => {
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
 * admin: register add livestock
 * @param {*} req
 * @param {*} res
 */
exports.addLivestocks = async (req, res) => {
  try {
    let {
      liveStockSupplierId,
      type,
      breed,
      tagNo,
      weight,
      age,
      residential,
      ranchId,
      sex,
    } = req.body;
    await db.liveStock
      .create({
        type,
        breed,
        weight,
        age,
        residential,
        sex,
        tagNo,
        localRanch: ranchId,
        livestocksupplier: liveStockSupplierId,
      })
      .then((result) => {
        sendData(result, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * list all livestocks
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.listalliveStocks = async (req, res) => {
  try {
    await db.liveStock
      .findAll({
        include: [
          { model: db.livestockSupplier },
          {
            model: db.ranch,
            include: [
              //ranch manager
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
          },
          { model: db.vaccine },
        ],
        order: [["createdAt", "DESC"]],
      })
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
/**
 * admin: list liveStock in a ranch
 * @param {*} req
 * @param {*} res
 */
exports.listranchliveStocks = async (req, res) => {
  try {
    let { ranchname } = req.params;
    await db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
        include: [{ model: db.liveStock }],
      })
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
/**
 * list livestocks by their residence on a ranch
 * @param {*} req 
 * @param {*} res 
 */
exports.listranchliveStocksByResidence = async (req, res) => {
  try {
    let { ranchname, residence } = req.params;
    await db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
        include: [
          {
            model: db.liveStock,
            where: {
              residential: residence,
            },
          },
        ],
      })
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
/**
 * admin: delete livestock
 * @param {*} req
 * @param {*} res
 */
exports.deleteliveStock = async (req, res) => {
  try {
    let { id } = req.params;
    await db.liveStock
      .findOne({
        where: {
          id,
        },
      })
      .then((result) => {
        result.destroy();
      })
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
/**
 * admin: update live stock supplier
 * @param {*} req
 * @param {*} res
 */
exports.updateliveStockSupplier = async (req, res) => {
  try {
    let { id } = req.params;
    await db.livestockSupplier
      .update(
        {
          ...req.body,
        },
        {
          where: {
            id,
          },
        }
      )
      .then((result) => {
        sendData({liveStockSupplier: result}, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: update liveStock
 * @param {*} req
 * @param {*} res
 */
exports.updateliveStock = async (req, res) => {
  try {
    let { id } = req.params;

    await db.liveStock
      .update(
        {
          ...req.body,
        },
        {
          where: {
            id,
          },
        }
      )
      .then((result) => {
        sendData({liveStock: result}, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * total livestocks
 * @param {*} req 
 * @param {*} res 
 */
exports.totalLiveStocks = async (req, res) => {
  try {
    await db.liveStock
      .count({})
      .then((result) => {
        sendData({ totalNumber: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * total livestocks based on residence
 * @param {*} req 
 * @param {*} res 
 */
exports.totalLiveStocksByResidence = async (req, res) => {
  let { residence } = req.params
  try {
    await db.liveStock
      .count({
        where:{
          residential: residence
        }
      })
      .then((result) => {
       sendData({ totalNumber: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * total ranch livestock
 * @param {*} req 
 * @param {*} res 
 */
exports.totalRanchLiveStocks = async (req, res) => {
  try {
    let { ranchId } = req.params;
    await db.liveStock
      .count({
        where: {
          localRanch: ranchId,
        },
      })
      .then((result) => {
        sendData({ totalNumber: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {}
};
/**
 * total ranch livestock by residence
 * @param {*} req 
 * @param {*} res 
 */
exports.totalRanchLiveStocksByResidence = async (req, res) => {
  try {
    let { ranchId, residence } = req.params;
    await db.liveStock
      .count({
        where: {
          localRanch: ranchId,
          residential: residence
        },
      })
      .then((result) => {
        sendData({totalNumber: result}, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {}
};
