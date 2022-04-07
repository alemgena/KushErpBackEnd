module.exports = (sequelize, dataTypes) => {
  const govoffice = sequelize.define("govoffice", {
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

    email: {
      type: dataTypes.STRING,
      unique: true,
    },
    phoneNo: {
      type: dataTypes.STRING,
      unique: true,
    },
    location: {
      type: dataTypes.STRING,
      defaultValue: "none",
    },
  });
  govoffice.associate = (models) => {
    govoffice.hasMany(models.user, {
      foreignKey: { name: "govermentOffice", allowNull: true },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };
  return govoffice;
};
