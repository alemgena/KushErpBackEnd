const { result, parseInt, forEach } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");
/**
 * record livestock vaccine
 * @param {*} req
 * @param {*} res
 */
exports.vaccinateLiveStock = async (req, res) => {
  let { liveStockId, vaccineId } = req.body;
  try {
    await db.vaccinationFollowUp
      .create({
        livestock: liveStockId,
        vaccine: vaccineId,
      })
      .then((result) => {
          this.countVaccRound(req, res)
        res.status(200).json({
          result,
        });
      });
  } catch (err) {
    res.status(400).json({
      VaccineLiveStockErr: err,
    });
  }
};
/**
 * count the number of rounds a single livestock vaccinated a single vaccine
 * @param {*} req
 * @param {*} res
 */
exports.countVaccRound = async (req, res) => {
  let { vaccineId, liveStockId } = req.body;
  try {
    await db.vaccinationFollowUp
      .count({
        where: {
          livestock: liveStockId,
          vaccine: vaccineId,
        },
        include: [{ model: db.liveStock }, { model: db.vaccine }],
      })
      .then((vacc_record) => {
          this.updateLiveStockVacFollowUp(req, res, vacc_record)
        res.status(200).json({
          vacc_record,
        });
      });
  } catch (err) {
    res.status(400).json({
      countVaccRoundErr: err,
    });
  }
};

exports.updateLiveStockVacFollowUp = async (req, res, vacc_record) => {
  let { vaccineId, liveStockId } = req.body;
  try {
    await db.vaccine
      .findOne({
        id: vaccineId,
      })
      .then(async (vaccine) => {
        if (vaccine.round === vacc_record) {
          await db.vaccinationFollowUp
            .update({
              concludeVaccinationFollowUp: true,
            })
            .then((result) => {
              res.status(200).json({
                result,
              });
            });
        }
      });
  } catch {
    res.status(400).json({
      updateLiveStockVacFollowUpErr: err,
    });
  }
};
