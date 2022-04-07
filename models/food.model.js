module.exports = (sequelize, dataTypes) => {
  const food = sequelize.define("food", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: dataTypes.STRING,
      allowNull: false,
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
  food.associate = (models) => {
    // food.belongsToMany(models.ranch, {
    //   through: "food_consumption",
    //   foreignKey: { name: "food", allowNull: true },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
    food.belongsTo(models.ranch, {
      foreignKey: { name: "ranchId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return food;
};
