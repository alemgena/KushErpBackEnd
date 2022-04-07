module.exports =(sequelize, dataTypes)=> {
    const admin = sequelize.define("admin", {
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
      },
      sex: {
        allowNull: false,
        type: dataTypes.STRING,
        defaultValue: "male",
        value: ["male", "female"],
      },
      password: {
        type: dataTypes.STRING,
        allowNull: false,
      },
      profilePicture: {
        type: dataTypes.STRING,
      },
      role: {
        type: dataTypes.STRING,
        defaultValue: "admin",
      },
    });
    return admin
  }