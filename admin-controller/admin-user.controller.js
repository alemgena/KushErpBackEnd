const { result, parseInt, forEach, sumBy } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
const { ranchManager, inspector } = require("../controllers");
const {
  errorHandler,
  notifyUser,
  sendData,
  omitNullValues,
  omitNullValuesObj,
} = require("../_helper");
/**
 *admin: register user
 * @param {*} req
 * @param {*} res
 */
const assign_random_value = (values) => {
  const random = Math.floor(Math.random() * values.length);
  return values[random];
};
/** registering random users for test use only: below */
exports.registerRandomUsers = async (req, res, users) => {
  const password = "21";

  try {
    for (let i = 0; i < 10; i++) {
      let firstName = `user-${Math.floor(10 + Math.random() * 9)}`;
      let lastName = `user-${Math.floor(10 + Math.random() * 9)}`;
      let sex = assign_random_value(["male", "female"]);
      const username = `${firstName}-${generator.generate({
        length: 2,
        numbers: true,
      })}`;
      const email = `${username}@gmail.com`;
      const phoneNo = `${Math.floor(100000000 + Math.random() * 900000000)}`;
      let role = assign_random_value(["ranchManager", "inspector"]);
      console.log(`random data ${i}`, {
        firstName,
        lastName,
        username,
        sex,
        phoneNo,
        password,
        role,
      });
      try {
        if (role !== "inspector") {
          await db.user
            .create({
              firstName,
              lastName,
              sex,
              role,
              email,
              phoneNo,
              username,
              password,
              activate: true,
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        } else {
          const company = assign_random_value(["MoH", "MoAH", "MoT"]);
          await db.user
            .create({
              firstName,
              lastName,
              sex,
              role,
              email,
              company,
              phoneNo,
              username,
              password,
              activate: true,
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        }
      } catch (err) {
        errorHandler(err, res);
      }
    }
    notifyUser("registering multiple users was successfull!", res);
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * assigining ranch managers randomly
 * @param {*} req
 * @param {*} res
 */
exports.assignRanchManagersRandomly = async (req, res) => {
  try {
    await db.ranch.findAll({}).then(async (ranches) => {
      if (ranches.length !== 0) {
        await db.user
          .findAll({
            where: {
              role: "ranchManager",
            },
          })
          .then((ranchManagers) => {
            let pointer = 0;
            for (let i = 0; i < ranches.length; i++) {
              for (let j = pointer; j < ranchManagers.length; j++) {
                if (ranches[i].ranchId === undefined) {
                  ranchManagers[j].update({ ranchId: ranches[i].id });
                  j++;
                  pointer = j;
                  break;
                } else {
                  continue;
                }
              }
            }
            notifyUser("ranchmanagers are assigned successfully!", res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
      } else {
        errorHandler("no registered ranch found", res);
      }
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * registering random users, assign ranch managers for test use only: above
 *
 */
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, sex, role, email, phoneNo, truckId } =
      req.body;
    // console.log("req.body: ", req.body);
    let pass = generator.generate({
      length: 8,
      numbers: true,
    });
    const username = `${firstName}-${generator.generate({
      length: 2,
      numbers: true,
    })}`;
    const password = await bcrypt.hash(pass, 12);

    await db.user
      .create({
        firstName,
        lastName,
        sex,
        role,
        email,
        phoneNo,
        username,
        password,
        pass,
        truckId,
        activate: true,
      })
      .then((result) => {
        let { dataValues } = result;
        dataValues.password = undefined;
        dataValues.activate = undefined;
        sendData({ user: omitNullValuesObj(dataValues) }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      })
      .catch((err) => {
        errorHandler(err, res);
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
exports.adminRegisterInspectors = async (req, res) => {
  try {
    const { govOfficeName } = req.params;
    const {  firstName, lastName, sex, email, phoneNo } =
      req.body;
    let role = "inspector"
    await db.govoffice
      .findOne({
        where: {
          name: govOfficeName,
        },
      })
      .then(async (govOffice) => {
        await db.privilege
          .create({})
          .then(async (privilege) => {
            let pass = generator.generate({
              length: 8,
              numbers: true,
            });
            const username = `${firstName}-${generator.generate({
              length: 2,
              numbers: true,
            })}`;
            const password = await bcrypt.hash(pass, 12);
            await db.user
              .create({
                firstName,
                lastName,
                sex,
                role,
                email,
                phoneNo,
                username,
                privilegeId: privilege.id,
                govermentOffice: govOffice.id,
                pass,
                password,
                activate: true,
              })
              .then((result)=>{
                sendData({result: result}, res)
              })
              .catch((err) => {
                throw err;
              });
          })
        
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.adminUpdateInspectorPrivilege = async (req, res) => {
  try {
    let { inspectorId } = req.params;
    let {
      viewAllRanches,
      viewRanch,
      viewLiveStock,
      viewAllVaccine,
      viewVaccine,
      viewAllMedicine,
      viewAllProteins,
      viewProteins,
      viewtotalLiveStocks,
      viewtotalLiveStocksByResidence,
      viewtotalRanchLiveStocks,
      viewtotalRanchLiveStocksByResidence,
    } = req.body;
    await db.user
      .findOne({
        where: {
          id: inspectorId,
        },
      })
      .then(async (inspector) => {
        return await db.privilege.update(
          {
            viewAllRanches,
            viewRanch,
            viewLiveStock,
            viewAllVaccine,
            viewVaccine,
            viewAllMedicine,
            viewAllProteins,
            viewProteins,
            viewtotalLiveStocks,
            viewtotalLiveStocksByResidence,
            viewtotalRanchLiveStocks,
            viewtotalRanchLiveStocksByResidence,
          },
          {
            where: {
              id: inspector.privilegeId,
            },
          }
        );
      })
      .then((result) => {
        if (result !== null) {
          notifyUser("successfully updated!", res);
        } else {
          console.log(result);
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
 * admin: list all registered users
 * @param {*} req
 * @param {*} res
 */
exports.listUsersbyRole = async (req, res) => {
  try {
    let { userRole } = req.params;
    if (userRole === "ranchManager") {
      await db.user
        .findAll({
          where: {
            role: userRole,
          },
          attributes: { exclude: ["password", "code", "activate"] },
          include: [{ model: db.ranch }],
          order: [["createdAt", "DESC"]],
        })
        .then((users) => {
          users = omitNullValues(users);
          sendData({ users: users }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
    } else if (userRole === "inspector") {
      await db.user
        .findAll({
          where: {
            role: userRole,
          },
          include: [{ model: db.govoffice }],
          order: [["createdAt", "DESC"]],
        })
        .then((users) => {
          users = omitNullValues(users);
          sendData({ users: users }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
    } else if (userRole === "truck_driver") {
      await db.user
        .findAll({
          where: {
            role: userRole,
          },
          include: [
            {
              model: db.truck,
              // include: [{ model: db.deliveryAgent }],
            },
          ],
          order: [["createdAt", "DESC"]],
        })
        .then((users) => {
          console.log("user ", users);
          users = omitNullValues(users);
          sendData({ users: users }, res);
        })
        .catch((err) => {
          console.log("err ", err);
          errorHandler(err, res);
        });
    } else {
      errorHandler("non existing role!", res);
    }
  } catch (err) {
    console.log("user ", err);
    errorHandler(err, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.listallUsers = async (req, res) => {
  try {
    await db.user
      .findAll({
        attributes: { exclude: ["password", "code", "activate"] },
        include: [
          { model: db.ranch },
          { model: db.govoffice },
          { model: db.truck, include: [{ model: db.deliveryAgent }] },
        ],
        order: [["createdAt", "DESC"]],
      })
      .then(async (users) => {
        users = omitNullValues(users);
        console.log("users: ", users);
        sendData({ users: users }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

/**
 * admin: delete a user
 * @param {*} req
 * @param {*} res
 */
exports.deleteuser = async (req, res) => {
  try {
    let { username } = req.params;
    await db.user
      .findOne({
        where: {
          username,
        },
      })
      .then((user) => {
        if (user !== null) {
          user.destroy();
          notifyUser("user deleted successfully!", res);
        } else {
          errorHandler("user is not found!", res);
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
 * admin: update user
 * @param {*} req
 * @param {*} res
 */
exports.updateUser = async (req, res) => {
  try {
    let { username } = req.params;
    await db.user
      .findOne({
        where: {
          username,
        },
      })
      .then((user) => {
        return user.update(req.body);
      })
      .then((updatedUser) => {
        sendData({ user: updatedUser }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * admin assign ranch manager
 * @param {*} req
 * @param {*} res
 */
exports.assign_ranchManager = async (req, res) => {
  try {
    let { ranchname } = req.params;
    let { firstName, lastName, sex, role, email, phoneNo } = req.body;
    let pass = generator.generate({
      length: 8,
      numbers: true,
    });
    const username = `${firstName}-${generator.generate({
      length: 2,
      numbers: true,
    })}`;
    const password = await bcrypt.hash(pass, 12);
    await db.ranch
      .findOne({
        where: {
          name: ranchname,
        },
      })
      .then(async (ranch) => {
        if (ranch !== null) {
          await db.user
            .create({
              firstName,
              lastName,
              sex,
              role,
              email,
              phoneNo,
              username,
              password,
              pass,
              ranchId: ranch.id,
              activate: true,
            })
            .then((ranchManager) => {
              (ranchManager.dataValues.password = undefined),
                (ranchManager.dataValues.activate = undefined);
              sendData(
                {
                  user: {
                    ...omitNullValuesObj(ranchManager.dataValues),
                    ranchname: ranch.name,
                  },
                },
                res
              );
            })
            .catch((err) => {
              throw err;
            });
        } else {
          errorHandler("ranch doesn't exist", res);
        }
      });
  } catch (err) {
    // console.log("err ", err)
    errorHandler(err, res);
  }
};
/**
 * admin assign truck drivers
 * @param {*} req
 * @param {*} res
 */
exports.assign_truckDriver = async (req, res) => {
  try {
    let { licencePlate, username } = req.params;
    await db.user
      .findOne({
        where: {
          [Op.and]: [{ username }, { role: "truck_driver" }],
        },
      })
      .then(async (user) => {
        await db.truck
          .findOne({
            where: {
              licencePlate,
            },
          })
          .then((truck) => {
            return user.update({ truckId: truck.id });
          })
          .then((truck_driver) => {
            sendData({ truckdriver: truck_driver }, res);
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
 * @param {*} res
 * @param {*} req
 */
exports.totalUsers = async (res, req) => {
  try {
    await db.user
      .count({})
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
 *
 * @param {*} res
 * @param {*} req
 */
exports.totalUsersByRole = async (res, req) => {
  try {
    let { role } = req.body;
    await db.user
      .count({
        where: {
          role,
        },
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.adminViewInspectorPrivilege = async (req, res) => {
  try {
    let { inspectorId } = req.params;
    await db.user
      .findOne({
        where: {
          [Op.and]: [{ id: inspectorId }, { role: "inspector" }],
        },
        include: [{ model: db.govermentOffice }, { model: db.privilege }],
      })
      .then((result) => {
        if (result !== null) {
          sendData({ result: result }, res);
        } else {
          throw new Error("inspector not found!");
        }
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.adminViewInspectorPrivilege = async (req, res) => {
  try {
    let { inspectorId } = req.params;
    await db.user
      .findOne({
        where: {
          [Op.and]: [{ id: inspectorId }, { role: "inspector" }],
        },
        include: [{ model: db.govermentOffice }, { model: db.privilege }],
      })
      .then((result) => {
        if (result !== null) {
          sendData({ result: result }, res);
        } else {
          throw new Error("inspector not found!");
        }
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.updateInspectorPrivilege = async (req, res) => {
  try {
    let { inspectorId } = req.params;
    await db.user
      .findOne({
        where: {
          id: inspectorId,
        },
        include: [{ model: db.privilege }],
      })
      .then((result) => {});
  } catch (error) {
    errorHandler(error, res);
  }
};
