module.exports = (sequelize, dataTypes) => {
  const liveStock = sequelize.define("liveStock", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    tagNo: {
      allowNull: false,
      type: dataTypes.STRING,
    },
    type: {
      allowNull: false,
      type: dataTypes.STRING,
    },
    sex: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "male",
      value: ["male", "female"],
    },
    origin: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    breed: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: dataTypes.STRING, //INTEGER
      defaultValue: "0",
    },
    unit: {
      type: dataTypes.STRING,
      defaultValue: "KG",
    },
    age: {
      type: dataTypes.STRING, //INTEGER
      defaultValue: 0,
    },
    residential: {
      type: dataTypes.STRING,
      defaultValue: "onRanch",
      value: ["onRanch", "offRanch"],
    },
    healthCondition: {
      type: dataTypes.STRING,
      defaultValue: "normal",
      value: ["normal", "wounded", "sick", "normal_wound"],
    },
    ready: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    ranchname: {
      type: dataTypes.STRING,
    },
  });
  liveStock.associate = (models) => {
    liveStock.belongsTo(models.ranch, {
      foreignKey: { name: "localRanch", allowNull: false },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    liveStock.belongsToMany(models.medicine, {
      through: "livestock_medicineFollwUp",
      foreignKey: { name: "liveStock", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    liveStock.belongsToMany(models.vaccine, {
      through: "vaccinationFollowUp",
      foreignKey: {
        name: "liveStock",
        allowNull: true,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    liveStock.belongsToMany(models.protein, {
      through: "liveStock_proteinIntake",
      foreignKey: {
        name: "liveStock",
        allowNull: true,
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    liveStock.belongsTo(models.livestockSupplier, {
      foreignKey: { name: "livestocksupplier", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    liveStock.belongsTo(models.response, {
      foreignKey: { name: "responseId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return liveStock;
};
