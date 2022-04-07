const auth = require('./userAutherization')
const authAdmin = require("./authAdmin")
const _middleware = {
    auth, authAdmin
}
module.exports = _middleware