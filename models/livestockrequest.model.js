module.exports = (sequelize, dataTypes) => {
  const livestockrequest = sequelize.define("livestockrequest", {
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
    weight: {
      type: dataTypes.STRING,
      defaultValue: "any",
    },
    breed: {
      type: dataTypes.STRING,
      defaultValue: "any",
    },
    age: {
      type: dataTypes.STRING,
      defaultValue: "any",
    },
    color: {
      type: dataTypes.STRING,
      defaultValue: "any",
    },
    origin: {
      type: dataTypes.STRING,
      defaultValue: "any",
    },
    quantity: {
      type: dataTypes.INTEGER,
      allowNull: false,
    },
  });
  livestockrequest.associate = (models) => {
    livestockrequest.belongsTo(models.request, {
      foreignKey: { name: "livestock_request", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return livestockrequest;
};
