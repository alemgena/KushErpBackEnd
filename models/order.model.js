const { sendData, notifyUser } = require("../_helper");
const db = require("../models");
module.exports = (sequelize, dataTypes) => {
  const order = sequelize.define("order", {
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
      allowNull: true,
    },
    email: {
      type: dataTypes.STRING,
      unique: false,
    },
    phoneNo: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    orderDate: {
      allowNull: false,
      type: dataTypes.STRING,
    },
    productId: {
      allowNull: false,
      type: dataTypes.STRING,
      defaultValue: "male",
      value: ["male", "female"],
    },
    quantity: {
      type: dataTypes.STRING,
    },
    origin: {
      type: dataTypes.STRING,
    },
    delivery_method: {
      type: dataTypes.STRING,
    },
    destination: {
      type: dataTypes.STRING,
    },
    quantity: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    currency: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    totalPrice: {
      type: dataTypes.STRING,
    },
  });
  order.associate = (models) =>{
    order.hasOne(models.request, {
      foreignKey: { name: "orderId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  }
  return order;
};
