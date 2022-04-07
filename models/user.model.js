const { sendData, notifyUser } = require("../_helper");
const db = require("../models");
module.exports = (sequelize, dataTypes) => {
  const user = sequelize.define("user", {
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
    email: {
      type: dataTypes.STRING,
      unique: true,
    },
    phoneNo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    username: {
      allowNull: false,
      type: dataTypes.STRING,
      unique: true,
    },
    sex: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "male",
      value: ["male", "female"],
    },

    activate: {
      type: dataTypes.BOOLEAN,
      defaultValue: false,
    },
    code: {
      type: dataTypes.INTEGER,
    },
    password: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    pass: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: dataTypes.STRING,
    },
    role: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "user",
      value: ["truck_driver", "ranchManager", "inspector", "user"],
    },
  });
  
  user.associate = (models) => {
    user.belongsTo(models.ranch, {
      foreignKey: { name: "ranchId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    user.belongsTo(models.privilege, {
      foreignKey: { name: "privilegeId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    user.belongsTo(models.truck, {
      foreignKey: { name: "truckId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
     user.belongsTo(models.govoffice, {
       foreignKey: { name: "govermentOffice", allowNull: true },
       onUpdate: "CASCADE",
       onDelete: "CASCADE",
     });
  };
  return user;
};
