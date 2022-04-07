const { values } = require("lodash");

module.exports = (sequelize, dataTypes) => {
  const truck = sequelize.define("truck", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    licencePlate: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    currentLocation: {
      type: dataTypes.STRING,
      defaultValue: "delivery-agent-location",
    },
    cargo: {
      type: dataTypes.STRING,
      defaultValue: "non",
      value: ["non", "supply", "livestock"],
    },
    capacity: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    onduty: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  truck.associate = (models) => {
    truck.belongsTo(models.delivery, {
      foreignKey: { name: "deliveryId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    truck.belongsTo(models.deliveryAgent, {
      foreignKey: { name: "deliveryAgentId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    truck.hasOne(models.user, {
      foreignKey: { name: "truckId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return truck;
};
