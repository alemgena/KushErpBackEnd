module.exports = (sequelize, dataTypes) => {
  const vaccinationFollowUp = sequelize.define("vaccinationFollowUp", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    livestock: {
      type: dataTypes.UUID,
      primaryKey: false,
      field: "liveStock",
      references: {
        model: "liveStock",
        key: "id",
      },
    },
    vaccine: {
      type: dataTypes.UUID,
      primaryKey: false,
      field: "vaccine",
      references: {
        model: "vaccine",
        key: "id",
      },
    },
    concludeVaccinationFollowUp: {
      allowNull: false,
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    currentRound: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  });

  return vaccinationFollowUp;
};
