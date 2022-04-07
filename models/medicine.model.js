module.exports = (sequelize, dataTypes) => {
  const medicine = sequelize.define("medicine", {
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
    rounds: {
      allowNull: false,
      type: dataTypes.INTEGER,
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
  medicine.associate = (models) => {
    medicine.belongsToMany(models.liveStock, {
      through: "livestock_medicineFollwUp",
      foreignKey: { name: "medicine", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    medicine.belongsTo(models.ranch, {
      foreignKey: { name: "ranchId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return medicine;
};
