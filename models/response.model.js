module.exports = (sequelize, dataTypes) => {
  const response = sequelize.define("response", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    quantity: {
      type: dataTypes.STRING,
      defaultValue: "0",
    },
    respond: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    request_ranchname: {
      type: dataTypes.STRING,
    },
    response_ranchname: {
      type: dataTypes.STRING,
    },
  });
  response.associate = (models) => {
    response.belongsTo(models.ranch, {
      foreignKey: { name: "response_ranch", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    response.belongsTo(models.request, {
      foreignKey: { name: "requestId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    response.hasMany(models.liveStock, {
      foreignKey: {name:"responseId", allowNull:false},
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    response.hasMany(models.delivery, {
      foreignKey: { name: "responseId" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return response;
};
