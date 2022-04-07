const { result } = require("lodash");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
let generator = require("generate-password");
const db = require("../models");

/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.updateliveStockFollowUp = async (req, res) => {
  let { livestockId, vaccineId } = req.body;
  try {
    let count = db.vaccinationFollowUp.count({
      where: {
        [Op.and]: [{ livestock: livestockId }, { vaccine: vaccineId }],
      },
    });
    if (count) {
      let vaccine = await db.vaccine.findOne({
        where: {
          id: vaccineId,
        },
      });
      if (count === vaccine.round) {
        db.liveStock.update(
          {
            concludeVaccinationFollowUp: true,
          },
          {
            where: {
              id: livestockId,
            },
          }
        );
      }
    }
  } catch (err) {
    res.json({
      msg: `updateliveStockFollowUp: ${err}`,
    });
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
exports.vaccinateLiveStock = async (req, res) => {
  let { livestockId, vaccineId } = req.body;
  res.json({
    vaccineFollowUp: await db.vaccinationFollowUp.create({
      livestock: livestockId,
      vaccine: vaccineId,
    }),
  });
};

exports.listallgrantedreqeuest = async (req, res) => {
  res.json({
    grantedRequests: await db.request.findAll({
      where: {
        grant: true,
      },
      include: [
        { model: db.livestockrequest },
        { model: db.vaccinereqeuest },
        { model: db.proteinreqeuest },
        { model: db.foodrequest },
        { model: db.medicinereqeuest },
      ],
    }),
  });
};
exports.approverequest = async (req, res) => {
 
  try {
     let { request } = req.params;
     let { dataValues: ranch } = req.ranch;
    await db.ranch
      .findOne({
        where: {
          name: ranch,
        },
        include: [{ model: db.user }],
      })
      .then(async (ranch) => {
        await db.approveRequest
          .create({
            type: "livestock",
            Ranch: ranch.id,
            accepted: true,
          })
          .then(async (result) => {
            console.log("result ", result);
            await db.request
              .update(
                {
                  srcRanch: result.id,
                  approved: true,
                },
                {
                  where: {
                    id: request,
                    grant: true,
                  },
                }
              )
              .then(async (result) => {
                await db.order.create({
                  sourceRanch: result.Ranch,
                });
              })
              .then((result) => {
                res.json({
                  requestApproved: result,
                });
              });
          });
      });
  } catch (err) {
    res.json({
      approverequestErr: err,
    });
  }
};
