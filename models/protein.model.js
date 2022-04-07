module.exports = (sequelize, dataTypes) => {
  const protein = sequelize.define("protein", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    dosage: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    productionDate: {
      type: dataTypes.STRING,

    },
    ExpirationDate: {
      allowNull: false,
      type: dataTypes.STRING,
    },
    discription: {
      allowNull: false,
      type: dataTypes.STRING,
    },
    source: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "mainRanch",
    },
    deliveryStatus: {
      type: dataTypes.STRING,
      defaultValue: "sent",
      value: ["sent", "received"],
    },
    ranchname: {
      type: dataTypes.STRING,
    },
  });
  protein.associate = (models) => {
    protein.belongsToMany(models.liveStock, {
      through: "liveStock_proteinIntake",
      foreignKey: { name: "protein", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    protein.belongsTo(models.ranch, {
      foreignKey: { name: "ranchId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return protein;
};
