module.exports = (sequelize, dataTypes) => {
  const privilege = sequelize.define("privilege", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    viewAllRanches: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewRanch: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewLiveStock: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewAllVaccine: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewVaccine: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },

    viewAllMedicine: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewAllProteins: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewProteins: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewtotalLiveStocks: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewtotalLiveStocksByResidence: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewtotalRanchLiveStocks: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    viewtotalRanchLiveStocksByResidence: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
  });
  privilege.associate = (models) => {
    privilege.hasMany(models.user, {
      foreignKey: { name: "privilegeId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return privilege;
};
