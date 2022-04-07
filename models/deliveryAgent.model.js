module.exports = (sequelize, dataTypes) => {
  const deliveryAgent = sequelize.define("deliveryAgent", {
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
      type: dataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: dataTypes.STRING,
      defaultValue: "selfOwned",
      value: ["selfOwned", "3rdparty"],
    },
    tinNumber: {
      type: dataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: dataTypes.STRING,
      allowNull: false,
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
    notrucks: {
      type: dataTypes.INTEGER,
      defaultValue: 0,
    },
    location: {
      type: dataTypes.STRING,
      allowNull: false,
    },
    photo: {
      type: dataTypes.STRING,
      allowNull: true,
    },
  });
  deliveryAgent.countTracks = async (deliveryAgentId) => {
    await db.truck.count({
      where: {
        deliveryAgent: deliveryAgentId,
      },
    })
    .then((result)=>{
      console.log(result)
    })
  };
  deliveryAgent.associate = (models) => {
    deliveryAgent.hasMany(models.truck, {
      foreignKey: { name: "deliveryAgentId", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    // deliveryAgent.hasMany(models.delivery, {
    //   foreignKey: { name: "delivery_Agent", allowNull: true },
    //   onUpdate: "CASCADE",
    //   onDelete: "CASCADE",
    // });
  };
  return deliveryAgent;
};
