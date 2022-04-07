
const server = require("../server");
const request = require("supertest");
beforeAll(async () => {
  await sequelize.sync();
});
describe("admin authentication", () => {
  it("should successfully signIn admin", async () => {});
});
