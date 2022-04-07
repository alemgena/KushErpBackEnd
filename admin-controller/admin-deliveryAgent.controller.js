const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { sendData, errorHandler, notifyUser } = require("../_helper");
const assign_random_value = (values) => {
  const random = Math.floor(Math.random() * values.length);
  return values[random];
};
exports.registerdeliveryAgentRandomly = async (req, res) => {
  for (let i = 0; i < 10; i++) {
    let firstName = `user-${Math.floor(10 + Math.random() * 9)}`;
    let lastName = `user-${Math.floor(10 + Math.random() * 9)}`;
    let sex = assign_random_value(["male", "female"]);
    let type = assign_random_value(["selfOwned", "3rdparty"]);
    const username = `${firstName}-${generator.generate({
      length: 2,
      numbers: true,
    })}`;
    const email = `${username}@gmail.com`;
    const phoneNo = `${Math.floor(100000000 + Math.random() * 900000000)}`;
    const tinNumber = `${Math.floor(100000000 + Math.random() * 900000000)}`;
    const notrucks = `${Math.floor(10 + Math.random() * 90)}`;
    const capacity = `${Math.floor(10 + Math.random() * 90)} KG`;
    const address = generator.generate({ length: 4 });
    let location = generator.generate({ length: 4 });
    let licencePlate = generator.generate({ length: 5, numbers: true });
    // console.log(`random data ${i}`, {
    //   firstName,
    //   lastName,
    //   sex,
    //   email,
    //   tinNumber,
    //   username,
    //   phoneNo,
    //   notrucks,
    //   type,
    //   location,
    //   licencePlate,
    //   capacity,
    // });
    try {
      await db.deliveryAgent
        .create({
          firstName,
          lastName,
          address,
          email,
          tinNumber,
          username,
          phoneNo,
          notrucks,
          sex,
          location,
        })
        .then(async (result) => {
          for (let j = 0; j < notrucks.length; j++) {
            await db.truck
              .create({
                licencePlate,
                capacity,
                onduty: true,
                currentLocation: result.location,
                deliveryAgentId: result.id,
              })
              .then(async (truck) => {
                let firstName = `deliveryAgent-${Math.floor(
                  10 + Math.random() * 9
                )}`;
                let lastName = `deliveryAgent-${Math.floor(
                  10 + Math.random() * 9
                )}`;
                let sex = assign_random_value(["male", "female"]);
                const username = `${firstName}-${generator.generate({
                  length: 2,
                  numbers: true,
                })}`;
                const email = `${username}@gmail.com`;
                const phoneNo = `${Math.floor(
                  100000000 + Math.random() * 900000000
                )}`;
                let password = "21";
                let role = "truck_driver";
                await db.user
                  .create({
                    firstName,
                    lastName,
                    sex,
                    username,
                    email,
                    phoneNo,
                    password,
                    role,
                    activate: true,
                    truckId: truck.id,
                  })
                  .catch((err) => {
                    res.status(400).json({
                      err: err,
                    });
                  });
              })
              .catch((err) => {
                res.status(400).json({
                  err: `@registering trucks ${err}`,
                });
              });
          }
        });
    } catch (err) {
      res.status(400).json({
        err: `admin registering delivery agent: ${err}`,
      });
    }
  }
  res.status(201).json({
    msg: "registering multiple delivery agent was sucessful",
  });
};
/**
 * admin: register delivery Agent
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.registerdeliveryAgent = async (req, res) => {
  // qunatity

  try {
    let {
      firstName,
      lastName,
      address,
      email,
      phoneNo,
      sex,
      username,
      location,
      tinNumber,
    } = req.body;
    await db.deliveryAgent
      .create({
      firstName,
        lastName,
        address,
        email,
        username,
        tinNumber,
        phoneNo,
        sex,
        location,
      })
      .then((result) => {
        sendData({deliveryAgent: result}, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: list all delivery agent
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.listalldeliveryagent = async (req, res) => {
  try {
    await db.deliveryAgent
      .findAll({
        include: [ { model: db.truck, include:[{ model: db.delivery },] }],
      })
      .then((result) => {
        sendData({deliveryAgent: result}, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: search delivery agent
 * @param {*} req
 * @param {*} res
 */
exports.searchDeliveryAgent = async (req, res) => {
  try {
    let { name } = req.body;
    await db.deliveryAgent
      .findOne({
        where: {
          name,
        },
      })
      .then((result) => {
        sendData(result, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: delete delivery agent
 * @param {*} req
 * @param {*} res
 */
exports.deleteDeliveryAgent = async (req, res) => {
  try {
    let { name } = req.body;
    await db.deliveryAgent
      .findOne({
        where: {
          name,
        },
      })
      .then((result) => {
        result.destroy();
        notifyUser("delivery agent deleted successfully!", res)
      })
      .catch(err=>{errorHandler(err, res)})
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin: update delivery agent
 * @param {*} req
 * @param {*} res
 */
exports.updateDeliveryAgent = async (req, res) => {
  try {
    let { id } = req.params;
    await db.deliveryAgent
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
        sendData(result, res)
      });
  } catch (err) {
    errorHandler(err, res)
  }
};
