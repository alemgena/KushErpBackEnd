module.exports = (sequelize, dataTypes) => {
  const delivery = sequelize.define(
    "delivery",
    {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      quantity: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      deliveryStatus: {
        type: dataTypes.STRING,
        defaultValue: "idle",
        value: ["idle", "pending", "on progress", "finished"],
      },
      onloadTime: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
      },
      offloadTime: {
        type: dataTypes.DATE,
      },
      delivered: {
        type: dataTypes.BOOLEAN,
        defaultValue: false,
      },
    }
  );
  delivery.associate = (models) => {
    delivery.hasOne(models.truck, {
      foreignKey: { name: "deliveryId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    delivery.belongsTo(models.ranch, {
      foreignKey: { name: "deliveryTo", allowNull: true, },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    // delivery.belongsTo(models.deliveryAgent, {
    //   foreignKey: { name: "deliveryAgentId", allowNull: true },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
    delivery.belongsTo(models.response, {
      foreignKey: { name: "responseId" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return delivery;
};
