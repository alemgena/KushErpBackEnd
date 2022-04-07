const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
/**
 * admin: register different kinds of supplies
 * @param {*} req
 * @param {*} res
 */
exports.registerRanchSupply = async (req, res) => {
  let { ranchId } = req.body;
  let {
    type,
    name,
    quantity,
    dosage,
    productionDate,
    ExpirationDate,
    discription,
    rounds,
  } = req.body;
  switch (type) {
    case "food":
      await db.food
        .create({
          name,
          quantity,
          ranch: ranchId,
        })
        .then((result) => {
          res.status(200).json({
            foodSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            foodSupplyErr: err,
          });
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
          ranch: ranchId,
        })
        .then((result) => {
          res.status(200).json({
            proteinSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            proteinSupplyErr: err,
          });
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
          ranch: ranchId,
        })
        .then((result) => {
          res.status(200).json({
            medicineSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            medicineSupplyErr: err,
          });
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
          ranch: ranchId,
        })
        .then((result) => {
          res.status(200).json({
            vaccineSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            vaccineSupplyErr: err,
          });
        });
      break;
    default:
      break;
  }
};
/**
 * admin: view ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.viewRanchSupply = async (req, res) => {
  let { ranchId } = req.params;
  await db.ranch
    .findOne({
      where: {
        id: ranchId,
      },
      include: [
        { model: db.food },
        { model: db.protein },
        { model: db.vaccine },
        { model: db.medicine },
      ],
    })
    .then((result) => {
      res.status(200).json({
        RanchSupply: result,
      });
    })
    .catch((err) => {
      res.status(400).json({
        RanchSupplyErr: err,
      });
    });
};
/**
 * admin: update ranch supply
 * @param {*} req
 * @param {*} res
 */
exports.updateSupply = async (req, res) => {
  let { type, id } = req.params;
  switch (type) {
    case "food":
      await db.food
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
          res.status(200).json({
            foodSupplyUpdate: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            foodSupplyErr: err,
          });
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
              id,
            },
          }
        )
        .then((result) => {
          res.status(200).json({
            proteinSupplyUpdate: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            proteinSupplyErr: err,
          });
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
              id,
            },
          }
        )
        .then((result) => {
          res.status(200).json({
            medicineSupplyUpdate: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            medicineSupplyErr: err,
          });
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
              id,
            },
          }
        )
        .then((result) => {
          res.status(200).json({
            vaccineSupplyUpdate: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            vaccineSupplyErr: err,
          });
        });
      break;
    default:
      break;
  }
};
/**
 * admin: delete ranch supply
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
          result.destroy();
        })
        .then((result) => {
          res.status(200).json({
            deletefoodSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            deletefoodSupplyErr: err,
          });
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
          result.destroy();
        })
        .then((result) => {
          res.status(200).json({
            deleteproteinSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            deleteproteinSupplyErr: err,
          });
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
          result.destroy();
        })
        .then((result) => {
          res.status(200).json({
            deletemedicineSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            deletemedicineSupplyErr: err,
          });
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
          res.status(200).json({
            deletevaccineSupply: result,
          });
        })
        .catch((err) => {
          res.status(400).json({
            deletevaccineSupplyErr: err,
          });
        });
      break;
  }
};
