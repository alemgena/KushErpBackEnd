module.exports = (sequelize, dataTypes) => {
  const livestockSupplier = sequelize.define("livestockSupplier", {
    id: {
      type: dataTypes.UUID,
      defaultValue: dataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    username: {
      allowNull: false,
      type: dataTypes.STRING,
      unique: true,
    },
    location: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
    phoneNo: {
      type: dataTypes.STRING,
      unique: true,
    },
    sex: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "male",
      value: ["male", "female"],
    },
    ranchname: {
      type: dataTypes.STRING,
    },
  });
  livestockSupplier.associate = (models) => {
    livestockSupplier.belongsTo(models.ranch, {
      foreignKey: { name: "localRanch", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    livestockSupplier.hasMany(models.liveStock, {
      foreignKey: { name: "livestocksupplier", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return livestockSupplier;
};
