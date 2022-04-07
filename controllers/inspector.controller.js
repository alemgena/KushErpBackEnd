const { result, parseInt, forEach } = require("lodash");
const { Op } = require("sequelize");
const db = require("../models");
const {
  sendData,
  errorHandler,
  notifyUser,
  omitNullValues,
  omitNullValuesObj,
} = require("../_helper");
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewAllRanches = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    console.log("inspector", privilegeId);
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewAllRanches) {
          await db.ranch
            .findAll({
              include: [
                { model: db.liveStock },
                { model: db.food },
                { model: db.protein },
                { model: db.vaccine },
                { model: db.medicine },
              ],
            })
            .then((ranches) => {
              if (ranches !== null) {
                sendData({ ranches: ranches }, res);
              } else {
                throw new Error("ranches are not found");
              }
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewAllRanches) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewRanch = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { ranchId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewRanch) {
          await db.ranch
            .findOne({
              where: { id: ranchId },
              include: [
                { model: db.liveStock },
                {
                  model: db.Supply,
                  include: [
                    { model: db.food },
                    { model: db.protein },
                    { model: db.vaccine },
                    { model: db.medicine },
                  ],
                },
              ],
            })
            .then((ranch) => {
              if (ranch !== null) {
                sendData({ ranch: ranch }, res);
              } else {
                throw new Error("ranch is not found");
              }
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewRanch) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewLiveStock = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { ranchId, liveStockId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewLiveStock) {
          await db.liveStock
            .findOne({
              where: {
                id: liveStockId,
              },
              include: [
                { model: db.ranch, where: { id: ranchId } },
                { model: db.vaccine },
                { model: db.medicine },
              ],
            })
            .then((liveStock) => {
              sendData({ liveStock: liveStock }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewLiveStock) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewAllVaccine = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewAllVaccine) {
          await db.vaccine
            .findAll({})
            .then((vaccines) => {
              sendData({ vaccines: vaccines }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewAllVaccine) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewVaccine = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { vaccineId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewVaccine) {
          await db.vaccine
            .findOne({
              where: {
                id: vaccineId,
              },
            })
            .then((vaccine) => {
              sendData({ vaccine: vaccine }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewVaccine) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewAllMedicine = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;

    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewAllMedicine) {
          await db.medicine
            .findAll({})
            .then((medicines) => {
              sendData({ medicines: medicines }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewAllMedicine) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewMedicine = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { medicineId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewMedicine) {
          await db.medicines
            .findOne({
              where: {
                id: medicineId,
              },
            })
            .then((medicine) => {
              sendData({ medicine: medicine }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewMedicine) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewAllProteins = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewAllProteins) {
          await db.protein
            .findAll({})
            .then((proteins) => {
              sendData({ proteins: proteins }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewAllProteins) {
            throw new Error("you are not authorized!");
          }
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
 *
 * @param {*} req
 * @param {*} res
 */
exports.viewProtein = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { proteinId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.viewProtein) {
          await db.protein
            .findOne({
              where: {
                id: proteinId,
              },
            })
            .then((protein) => {
              sendData({ protein: protein }, res);
            })
            .catch((err) => {
              throw err;
            });
        } else {
          if (!privilege.viewProtein) {
            throw new Error("you are not authorized!");
          }
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
 * total livestocks
 * @param {*} req
 * @param {*} res
 */
exports.totalLiveStocks = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.totalLiveStocks) {
          await db.liveStock
            .count({})
            .then((result) => {
              sendData({ totalNumber: result }, res);
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        } else {
          if (!privilege.totalLiveStocks) {
            throw new Error("you are not authorized!");
          }
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
 * total livestocks based on residence
 * @param {*} req
 * @param {*} res
 */
exports.totalLiveStocksByResidence = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { residence } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.totalLiveStocksByResidence) {
          await db.liveStock
            .count({
              where: {
                residential: residence,
              },
            })
            .then((result) => {
              sendData({ totalNumber: result }, res);
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        } else {
          if (!privilege.totalLiveStocksByResidence) {
            throw new Error("you are not authorized!");
          }
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
 * total ranch livestock
 * @param {*} req
 * @param {*} res
 */
exports.totalRanchLiveStocks = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { ranchId } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.totalRanchLiveStocks) {
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
        } else {
          if (!privilege.totalRanchLiveStocks) {
            throw new Error("you are not authorized!");
          }
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
 * total ranch livestock by residence
 * @param {*} req
 * @param {*} res
 */
exports.totalRanchLiveStocksByResidence = async (req, res) => {
  try {
    let privilegeId = req.profile.dataValues.privilegeId;
    let { ranchId, residence } = req.params;
    await db.privilege
      .findOne({
        where: {
          id: privilegeId,
        },
      })
      .then(async (privilege) => {
        if (privilege !== null && privilege.totalRanchLiveStocksByResidence) {
          await db.liveStock
            .count({
              where: {
                localRanch: ranchId,
                residential: residence,
              },
            })
            .then((result) => {
              sendData({ totalNumber: result }, res);
            })
            .catch((err) => {
              errorHandler(err, res);
            });
        } else {
          if (!privilege.totalRanchLiveStocksByResidence) {
            throw new Error("you are not authorized!");
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    errorHandler(error, res);
  }
};
