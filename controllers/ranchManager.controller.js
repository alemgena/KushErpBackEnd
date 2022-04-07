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
  omitNullValuesObj,
} = require("../_helper");
const { selectLiveStocks } = require("./delivery.controller");
/**
 * ranchManager: register ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.registerRanchSupply = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { type } = req.params;
    let {
      name,
      quantity,
      dosage,
      productionDate,
      ExpirationDate,
      discription,
      rounds,
      source,
    } = req.body;
    switch (type) {
      case "food":
        await db.food
          .create({
            name,
            quantity,
            source,
            ranchId: ranch.id,
            ranchname: ranch.name,
          })
          .then((result) => {
            sendData({ foodSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "protein":
        await db.protein
          .create({
            name,
            quantity,
            dosage,
            productionDate,
            ExpirationDate,
            discription,
            ranchId: ranch.id,
            ranchname: ranch.name,
            source,
          })
          .then((result) => {
            sendData({ proteinSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "medicine":
        await db.medicine
          .create({
            name,
            quantity,
            dosage,
            productionDate,
            ExpirationDate,
            discription,
            rounds,
            ranchId: ranch.id,
            ranchname: ranch.name,
            source,
          })
          .then((result) => {
            sendData({ medcineSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "vaccine":
        await db.vaccine
          .create({
            name,
            quantity,
            dosage,
            productionDate,
            ExpirationDate,
            discription,
            rounds,
            ranchId: ranch.id,
            ranchname: ranch.name,
            source,
          })
          .then((result) => {
            sendData({ vaccineSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      default:
        break;
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * ranchManager: view ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.viewRanchSupply = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.ranch
      .findAll({
        where: {
          id: ranch.id,
        },
        include: [
          { model: db.food },
          { model: db.protein },
          { model: db.vaccine },
          { model: db.medicine },
        ],
      })
      .then((result) => {
        sendData({ supplies: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
exports.viewRanchVaccine = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.ranch
      .findAll({
        where: {
          id: ranch.id,
        },
        include: [{ model: db.vaccine }],
      })
      .then((result) => {
        sendData({ vaccines: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 *
 */
exports.vaccinateLiveStocks = async (req, res) => {
  try {
    let { vaccineId, liveStockId } = req.params;
    console.log("liveStockTag:", liveStockId);
    await db.vaccinationFollowUp
      .findOne({
        where: {
          [Op.and]: [{ vaccine: vaccineId }, {livestock: liveStockId}],
        },
      })
      .then(async (vaccinationFollowUp) => {
        if (vaccinationFollowUp !== null) {
          await db.vaccine
            .findOne({
              where: {
                id: vaccineId,
              },
            })
            .then(async (vaccine) => {
              console.log("vaccine", vaccine.dataValues);
              console.log(
                "vaccinationFollowUp.currentRound",
                vaccinationFollowUp.currentRound,
                "vaccine.round",
                vaccine.dataValues.rounds,
                "vaccinationFollowUp.currentRound <= vaccine.round",
                vaccinationFollowUp.currentRound <= vaccine.round
              );
              if (
                parseInt(vaccinationFollowUp.currentRound) <=
                parseInt(vaccine.dataValues.rounds)
              ) {
                let inc = vaccinationFollowUp.currentRound + 1;
                console.log("inc", inc);
                inc === vaccine.round
                  ? vaccinationFollowUp
                      .update({ currentRound: inc })
                      .then((result) => {
                        sendData({ result: result }, res);
                      })
                  : vaccinationFollowUp
                      .update({
                        currentRound: inc,
                        concludeVaccinationFollowUp: true,
                      })
                      .then((result) => {
                        sendData({ result: result }, res);
                      });
              } else {
                throw new Error("maximum number of rounds reached!");
              }
            });
        } else {
          await db.vaccine
            .findOne({
              where: {
                id: vaccineId,
              },
            })
            .then(async (vaccine) => {
              if (vaccine !== null) {
                return await db.liveStock
                  .findOne({
                    where: {
                      id: liveStockId,
                    },
                  })
                  .then(async (liveStock) => {
                    if (liveStock !== null) {
                      console.log("liveStock", liveStock);
                      await db.vaccinationFollowUp
                        .create({
                          livestock: liveStock.id,
                          vaccine: vaccine.id,
                          currentRound: 1,
                        })
                        .then((vaccinationFollowUp) => {
                          console.log(
                            "vaccinationFollowUp",
                            vaccinationFollowUp
                          );
                          sendData(
                            { vaccinationFollowUp: vaccinationFollowUp },
                            res
                          );
                        });
                    } else {
                      throw new Error("liveStock not found!");
                    }
                  });
              } else {
                throw new Error("vaccine not found");
              }
            });
        }
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

exports.deleteLiveStockVaccinationFollowUp = async (req, res) => {
  try {
    let { liveStockVaccFollowUpId } = req.params;
    await db.vaccinationFollowUp
      .findOne({
        where: { id: liveStockVaccFollowUpId },
      })
      .then((result) => {
        if (result !== null) {
          result.destroy();
          notifyUser("recorded deleted successfully!", res);
        }
      });
  } catch (error) {
    errorHandler(error, res);
  }
};

/**
 * ranchManager: update ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.updateSupply = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { type } = req.params;
    switch (type) {
      case "food":
        await db.food
          .update(
            {
              ...req.body,
            },
            {
              where: {
                ranchId: ranch.id,
              },
            }
          )
          .then((result) => {
            sendData({ foodSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "protein":
        await db.protein
          .update(
            {
              ...req.body,
            },
            {
              where: {
                ranchId: ranch.id,
              },
            }
          )
          .then((result) => {
            sendData({ proteinSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "medicine":
        await db.medicine
          .update(
            {
              ...req.body,
            },
            {
              where: {
                ranchId: ranch.id,
              },
            }
          )
          .then((result) => {
            sendData({ medicineSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      case "vaccine":
        await db.vaccine
          .update(
            {
              ...req.body,
            },
            {
              where: {
                ranchId: ranch.id,
              },
            }
          )
          .then((result) => {
            sendData({ vaccineSupply: result }, res);
          })
          .catch((err) => {
            errorHandler(err, res);
          });
        break;
      default:
        break;
    }
  } catch (error) {
    errorHandler(error, res);
  }
};
/**
 * ranchManager: delete ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.deleteSupply = async (req, res) => {
  let { type, id } = req.params;
  switch (type) {
    case "food":
      await db.food
        .findOne({
          where: {
            id,
          },
        })
        .then((result) => {
          return result.destroy();
        })
        .then((result) => {
          notifyUser("deletion was successful!", res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    case "protein":
      await db.protein
        .findOne({
          where: {
            id,
          },
        })
        .then((result) => {
          return result.destroy();
        })
        .then((result) => {
          notifyUser("deleted successfully!", res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    case "medicine":
      await db.medicine
        .findOne({
          where: {
            id,
          },
        })
        .then((result) => {
          return result.destroy();
        })
        .then((result) => {
          notifyUser("deleted successfully!", res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    case "vaccine":
      await db.vaccine
        .findOne({
          where: {
            id,
          },
        })
        .then((result) => {
          result.destroy();
        })
        .then((result) => {
          notifyUser("deleted successfully!", res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
  }
};
/**
 * register local livestock supplier
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.registerlocallivestocksupplier = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { firstName, lastName, address, username, phoneNo, location, sex } =
      req.body; //assume name is unique for each ranch} = req.body
    await db.livestockSupplier
      .findOne({
        where: {
          [Op.or]: [
            { phoneNo },
            { username },
            { [Op.and]: [{ firstName }, { lastName }] },
          ],
        },
      })
      .then(async (result) => {
        if (result !== null) {
          errorHandler("livestock supplier exists!", res);
        } else {
          db.livestockSupplier
            .create({
              firstName,
              lastName,
              location,
              address,
              username,
              phoneNo,
              sex,
              localRanch: ranch.id,
              ranchname: ranch.name,
            })
            .then(async (result) => {
              sendData({ user: result }, res);
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        }
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 *update locallivestock supplier
 * @param {*} req
 * @param {*} res
 */
exports.updatelocallivestocksupplier = async (req, res) => {
  try {
    let { username } = req.params;
    await db.livestockSupplier
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
 * view local livestock supplier
 * @param {*} req
 * @param {*} res
 */
exports.viewlocallivestocksuppliers = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.livestockSupplier
      .findAll({
        where: {
          localRanch: ranch.id,
        },
      })
      .then((result) => {
        sendData({ livestockSuppliers: result }, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 *delete local livestock supplier
 * @param {*} req
 * @param {*} res
 */
exports.deletelocallivestocksupplier = async (req, res) => {
  let { id } = req.params;
  try {
    await db.livestockSupplier
      .findOne({
        where: {
          id,
        },
      })
      .then((user) => {
        console.log("user ", user);
        return user.destroy();
      })
      .then((result) => {
        notifyUser("deleted successfully!", res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * view local livestock
 * @param {*} req
 * @param {*} res
 */
exports.viewlocallivestocks = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.livestock
      .findAll({
        where: {
          localRanch: ranch.id,
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
 * view local livestock supplier
 * @param {*} req
 * @param {*} res
 */
exports.viewlocallivestockSupplier = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { liveStockSupplierId } = req.params;

    await db.livestockSupplier
      .findOne({
        where: {
          [Op.and]: [{ id: liveStockSupplierId }, { localRanch: ranch.id }],
        },
        include: [{ model: db.liveStock }],
      })
      .then((result) => {
        console.log("result:", result);
        sendData(result, res);
      });
  } catch (err) {
    console.log("err", err);
    errorHandler(err, res);
  }
};
/**
 * ranch manager: add livestock
 * @param {*} req
 * @param {*} res
 */
exports.addLivestocks = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { liveStockSupplierId } = req.params;
    let { type, breed, origin, tagNo, weight, age, residential, sex } =
      req.body;
    await db.liveStock
      .create({
        type,
        breed,
        weight,
        origin,
        age,
        residential,
        sex,
        tagNo,
        localRanch: ranch.id,
        ranchname: ranch.name,
        livestocksupplier: liveStockSupplierId,
      })
      .then((result) => {
        sendData({ liveStock: result }, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
/**
 * view local livestock supplier's livestocks
 * @param {*} req
 * @param {*} res
 */
exports.viewlocallivestocksupplierLiveStocks = async (req, res) => {
  try {
    let { liveStockSupplierId } = req.params;
    await db.liveStock
      .findAll({
        where: {
          livestocksupplier: liveStockSupplierId,
        },
      })
      .then(async (result) => {
        let quantity = result.length;
        console.log("quantity: ", quantity);
        if (quantity) {
          await db.livestockSupplier
            .findOne({
              id: liveStockSupplierId,
            })
            .then((liveStockSupplier) => {
              return liveStockSupplier.update({ quantity });
            })
            .then((result) => {
              sendData(
                { livestockSupplierQuantity: result.dataValues.quantity },
                res
              );
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        }
      });
  } catch (error) {}
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.liveStockShipment = async (req, res) => {
  try {
    let flag = false;
    let { dataValues: ranch } = req.ranch;
    let electedLiveStocks = req.body;
    console.log("electedLiveStocks:", electedLiveStocks);
    electedLiveStocks.forEach((id, i) => {
      db.liveStock
        .findOne({
          where: {
            id,
          },
        })
        .then(async (selectedLiveStock) => {
          await db.response
            .findOne({
              response_ranch: ranch.id,
            })
            .then((response) => {
              if (response !== null) {
                selectedLiveStock
                  .update({
                    ready: true,
                    responseId: response.id,
                  })
                  .then(() => {
                    flag = true;
                  });
              }
            });
        })
        .then(() => {
          console.log(flag);
          if (flag) {
            console.log(flag);
            notifyUser("livestocks successfuly selected!", res);
          }
        })
        .catch((err) => {
          throw err;
        });
    });
  } catch (error) {
    console.log(error);
    errorHandler(error, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.acknowledgeSupplyDelivery = async (req, res) => {
  let { dataValues: ranch } = req.ranch;
  let { type, supplyId } = req.params;
  switch (type) {
    case "food":
      await db.food
        .findOne({
          where: {
            id: supplyId,
          },
        })
        .then((result) => {
          return result.update(req.body);
        })
        .then((result) => {
          sendData({ ack: result }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    case "protein":
      await db.protein
        .findOne({
          where: {
            id: supplyId,
          },
        })
        .then((result) => {
          return result.update(req.body);
        })
        .then((result) => {
          sendData({ ack: result }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });

      break;
    case "medicine":
      await db.medicine
        .findOne({
          where: {
            id: supplyId,
          },
        })
        .then((result) => {
          return result.update(req.body);
        })
        .then((result) => {
          sendData({ ack: result }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    case "vaccine":
      await db.vaccine
        .findOne({
          where: {
            id: supplyId,
          },
        })
        .then((result) => {
          return result.update(req.body);
        })
        .then((result) => {
          sendData({ ack: result }, res);
        })
        .catch((err) => {
          errorHandler(err, res);
        });
      break;
    default:
      break;
  }
};
/**
 * register local delivery agent
 * @param {*} req
 * @param {*} res
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
        sendData({ deliveryAgent: result }, res);
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
        include: [{ model: db.truck, include: [{ model: db.delivery }] }],
      })
      .then((result) => {
        sendData({ deliveryAgent: result }, res);
      })
      .catch((err) => {
        errorHandler(err, res);
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
        notifyUser("delivery agent deleted successfully!", res);
      })
      .catch((err) => {
        errorHandler(err, res);
      });
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
        sendData(result, res);
      });
  } catch (err) {
    errorHandler(err, res);
  }
};

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
                sendData({ truckDriver: truck }, res);
              });
          })
          .catch((err) => {
            errorHandler(err, res);
          });
      })
      .catch((err) => {
        errorHandler(err, res);
      });
  } catch (err) {
    errorHandler(err, res);
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
        console.log("deliveryAgent ", deliveryAgentId);
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
        sendData({ trucks: result }, res);
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
/**
 * register local  livestock
 * @param {*} req
 * @param {*} res
 * @returns
 */
exports.registerlocallivestock = async (req, res) => {
  let { dataValues: ranch } = req.ranch;
  let { breed, weight, age, residential, sex, supplierId } = req.body; //assume name is unique for each ranch
  try {
    return await db.liveStock
      .create({
        sex,
        breed,
        weight,
        age,
        residential,
        livestocksupplier: supplierId,
        localRanch: ranch.id,
      })
      .then((result) => {
        sendData({ localLiveStockSupplier: result }, res);
      })
      .catch((err) => {
        throw err;
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
exports.viewLiveStockRequests = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.ranch
      .findOne({
        where: {
          id: ranch.id,
        },
      })
      .then(async (ranch) => {
        await db.response
          .findAll({
            where: {
              response_ranch: ranch.id,
            },
            include: [
              {
                model: db.request,
                where: { approved: true },
                include: [{ model: db.livestockrequest }],
              },
            ],
          })
          .then((result) => {
            console.log(result);
            sendData({ requests: result }, res);
          })
          .catch((err) => {
            throw err;
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
exports.totalRanchLiveStocks = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    await db.liveStock
      .count({
        where: {
          localRanch: ranch.id,
        },
      })
      .then((result) => {
        sendData({ totalLiveStocks: result }, res);
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    errorHandler(err, res);
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 *
 */
exports.respond_to_request = async (req, res) => {
  try {
    let { dataValues: ranch } = req.ranch;
    let { requestId } = req.params;
    let { quantity } = req.body;
    console.log("quantity", quantity);
    await db.response
      .findOne({
        where: {
          requestId,
        },
      })
      .then(async (request) => {
        console.log("request ", request);
        await db.response
          .update(
            {
              quantity,
              respond: true,
            },
            {
              where: { response_ranch: ranch.id },
            }
          )
          .then((result) => {
            notifyUser("respond to request success", res);
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
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
exports.registerDrivers = async (req, res) => {
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
 * list truck drivers
 * @param {*} req
 * @param {*} res
 */
exports.listDrivers = async (req, res) => {
  try {
    await db.user
      .findAll({
        attributes: { exclude: ["password", "code", "activate"] },
        include: [{ model: db.truck, include: [{ model: db.deliveryAgent }] }],
        order: [["createdAt", "DESC"]],
      })
      .then(async (users) => {
        users = omitNullValues(users);
        // console.log("users: ", users);
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
 *  delete a user
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
 * update user
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
 *  assign truck drivers
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
 * update truck state
 * @param {*} req
 * @param {*} res
 */
exports.updatetruckState = async (req, res) => {
  try {
    let { truckId } = req.params;
    let { state } = req.params; //false or true
    console.log("state ", state);
    await db.truck
      .findOne({
        where: {
          id: truckId,
        },
      })
      .then(async (truck) => {
        truck
          .update({
            onduty: state,
          })
          .then((result) => {
            sendData({ truck: result.dataValues.onduty }, res);
          })
          .catch((err) => {
            throw err;
          });
      });
  } catch (err) {
    errorHandler(err, res);
  }
};
