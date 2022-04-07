module.exports =(sequelize, dataTypes)=> {
    const ranch = sequelize.define("ranch", {
      id: {
        type: dataTypes.UUID,
        defaultValue: dataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: dataTypes.STRING,
        unique: true,
      },
      type: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      area: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      distance: {
        type: dataTypes.STRING,
        allowNull: false,
      },
    });
    ranch.associate = models => {
      ranch.hasOne(models.user, {
        foreignKey: { name: "ranchId", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      ranch.hasMany(models.liveStock, {
        foreignKey: { name: "localRanch", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      ranch.hasMany(models.delivery, {
        foreignKey: { name: "ranch_delivery", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      ranch.hasMany(models.livestockSupplier, {
        foreignKey: { name: "localRanch", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });

      ranch.hasMany(models.request, {
        foreignKey: { name: "request_ranch", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      });
      ranch.hasMany(models.response, {
        foreignKey: { name: "response_ranch", allowNull: true },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      })
       ranch.hasMany(models.food, {
         foreignKey: { name: "ranchId", allowNull: true },
         onUpdate: "CASCADE",
         onDelete: "CASCADE",
       });
       ranch.hasMany(models.protein, {
         foreignKey: { name: "ranchId", allowNull: true },
         onUpdate: "CASCADE",
         onDelete: "CASCADE",
       });
       ranch.hasMany(models.vaccine, {
         foreignKey: { name: "ranchId", allowNull: true },
         onDelete: "CASCADE",
         onUpdate: "CASCADE",
       });
        ranch.hasMany(models.medicine, {
          foreignKey: { name: "ranchId", allowNull: true },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        });
      //  ranch.belongsToMany(models.food, {
      //    through: "food_consumption",
      //    foreignKey: { name: "ranch", allowNull: true },
      //    onUpdate: "CASCADE",
      //    onDelete: "CASCADE",
      //  });
    }
    return ranch
}