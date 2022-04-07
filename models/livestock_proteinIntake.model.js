module.exports = (sequelize, dataTypes) => {
  const liveStock_proteinIntake = sequelize.define("liveStock_proteinIntake", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    liveStock: {
      type: dataTypes.UUID,
      references: {
        model: "liveStock",
        key: "id",
      },
    },
    protein: {
      type: dataTypes.UUID,
      references: {
        model: "protein",
        key: "id",
      },
    },
  });
  return liveStock_proteinIntake
};
