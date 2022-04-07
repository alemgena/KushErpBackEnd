module.exports = (sequelize, dataTypes) =>{
    const livestock_medicineFollwUp = sequelize.define(
      "livestock_medicineFollwUp",
      {
        id: {
          type: dataTypes.UUID,
          primaryKey: true,
          allowNull: false,
        },
        liveStock: {
          type: dataTypes.STRING,
          references: {
            model: "liveStock",
            key: "id",
          },
        },
        medicine: {
          type: dataTypes.STRING,
          references: {
            model: "medicine",
            key: "id",
          },
        },
      }
    );
    return livestock_medicineFollwUp;
}