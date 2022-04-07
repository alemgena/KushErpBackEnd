module.exports = (sequelize, dataTypes) => {
  const request = sequelize.define("request", {
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
    approved: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    ordered: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    ranchname: {
      type: dataTypes.STRING,
    },
  });
  request.associate = (models) => {
    request.hasOne(models.livestockrequest, {
      foreignKey: { name: "livestock_request", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    request.belongsTo(models.order, {
      foreignKey: { name: "orderId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    request.belongsTo(models.ranch, {
      foreignKey: { name: "request_ranch", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    request.hasMany(models.response, {
      foreignKey: { name: "requestId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return request;
};
