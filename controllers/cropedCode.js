if (w[0] === a[0]) {
  if (
    (w[0] === "Above" || w[0] === "above") &&
    (a[0] === "Above" || a[0] === "above")
  ) {
    return await db.ranch
      .findAll({
        where: {
          [Op.not]: [{ type: "Main Ranch" }],
        },
        include: [
          {
            model: db.liveStock,
            where: {
              breed,
              origin,
              weight: { [Op.gte]: [parseInt(w[1])] },
              age: { [Op.gte]: [parseInt(a[1])] },
            },
          },
        ],
      })
      .then(async (shortlistedRanch) => {
        console.log("shortlistedRanch: ", shortlistedRanch);
        shortlistedRanch.forEach(async (candidate_ranch) => {
          await db.response.create({
            requestId: request.id,
            request_ranchname: req.ranch.name,
            response_ranchname: candidate_ranch.name,
            response_ranch: candidate_ranch.id,
          });
        });
        notifyUserSucc("", res);
      })
      .catch((err) => {
        throw err;
      });
  } else if (
    (w[0] === "Equal" || w[0] === "equal") &&
    (a[0] === "Equal" || a[0] === "equal")
  ) {
    return await db.ranch
      .findAll({
        where: {
          [Op.not]: [{ type: "Main Ranch" }],
        },
        include: [
          {
            model: db.liveStock,
            where: {
              breed,
              origin,
              weight: { [Op.eq]: [parseInt(w[1])] },
              age: { [Op.eq]: [parseInt(a[1])] },
            },
          },
        ],
      })
      .then(async (shortlistedRanch) => {
        // console.log("shortlistedRanch: ", shortlistedRanch);
        shortlistedRanch.forEach(async (candidate_ranch) => {
          await db.response.create({
            requestId: request.id,
            request_ranchname: req.ranch.name,
            response_ranchname: candidate_ranch.name,
            response_ranch: candidate_ranch.id,
          });
        });
        notifyUserSucc("", res);
      })
      .catch((err) => {
        throw err;
      });
  } else if (
    (w[0] === "Below" || w[0] === "below") &&
    (a[0] === "Below" || a[0] === "below")
  ) {
    return await db.ranch
      .findAll({
        where: {
          [Op.not]: [{ type: "Main Ranch" }],
        },
        include: [
          {
            model: db.liveStock,
            where: {
              breed,
              origin,
              weight: { [Op.lte]: [parseInt(w[1])] },
              age: { [Op.lte]: [parseInt(a[1])] },
            },
          },
        ],
      })
      .then(async (shortlistedRanch) => {
        // console.log("shortlistedRanch: ", shortlistedRanch);
        shortlistedRanch.forEach(async (candidate_ranch) => {
          await db.response.create({
            requestId: request.id,
            request_ranchname: req.ranch.name,
            response_ranchname: candidate_ranch.name,
            response_ranch: candidate_ranch.id,
          });
        });
        notifyUserSucc("", res);
      })
      .catch((err) => {
        throw err;
      });
  } else {
    throw new Error("weight & age comparsor error @order");
  }
} else {
  if (
    (w[0] === "Below" || w[0] === "below") &&
    (a[0] === "Above" || a[0] === "above")
  ) {
    return await db.ranch
      .findAll({
        where: {
          [Op.not]: [{ type: "Main Ranch" }],
        },
        include: [
          {
            model: db.liveStock,
            where: {
              breed,
              origin,
              weight: { [Op.lte]: [parseInt(w[1])] },
              age: { [Op.gte]: [parseInt(a[1])] },
            },
          },
        ],
      })
      .then(async (shortlistedRanch) => {
        console.log("shortlistedRanch: ", shortlistedRanch);
        shortlistedRanch.forEach(async (candidate_ranch) => {
          await db.response.create({
            requestId: request.id,
            request_ranchname: req.ranch.name,
            response_ranchname: candidate_ranch.name,
            response_ranch: candidate_ranch.id,
          });
        });
        notifyUserSucc("", res);
      })
      .catch((err) => {
        throw err;
      });
  } else if (
    (w[0] === "Above" || w[0] === "above") &&
    (a[0] === "Below" || a[0] === "below")
  ) {
    return await db.ranch
      .findAll({
        where: {
          [Op.not]: [{ type: "Main Ranch" }],
        },
        include: [
          {
            model: db.liveStock,
            where: {
              breed,
              origin,
              weight: { [Op.gte]: [parseInt(w[1])] },
              age: { [Op.lte]: [parseInt(a[1])] },
            },
          },
        ],
      })
      .then(async (shortlistedRanch) => {
        // console.log("shortlistedRanch: ", shortlistedRanch);
        shortlistedRanch.forEach(async (candidate_ranch) => {
          await db.response.create({
            requestId: request.id,
            request_ranchname: req.ranch.name,
            response_ranchname: candidate_ranch.name,
            response_ranch: candidate_ranch.id,
          });
        });
        notifyUserSucc("", res);
      })
      .catch((err) => {
        throw err;
      });
  } else {
  }
}
