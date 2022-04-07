exports.notifyUser = (msg, res) => {
    if (typeof msg === "string") {
      // custom application error
      return res.status(200).json({ message: msg });
    }
}
exports.sendData = (data, res) => {
    return res.status(200).json(data)
}

exports.notifyUserSucc = (msg, res) => {
  if (typeof msg === "string") {
    // custom application error
    return res.status(200).json({ success: msg });
  }
};