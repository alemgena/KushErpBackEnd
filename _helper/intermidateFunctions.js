const _ = require("lodash");
exports.omitNullValues = (data) => {
  let tempArr = [];
  data.forEach((e, i) => {
    let tempObj = _.omitBy(e.dataValues, _.isNull);
    tempArr.push(tempObj);
  });
  return tempArr;
};
exports.omitNullValuesObj = (dataValues) =>{
  return _.omitBy((_.omitBy(dataValues, _.isUndefined)), _.isNull)
}
