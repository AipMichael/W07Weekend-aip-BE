require("dotenv").config();
const bcrypt = require("bcrypt");
/* const jwt = require("jsonwebtoken"); */
const User = require("../../database/models/user");
const { userLogin } = require("./userControllers");

jest.mock("../../database/models/user");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Given an userLogin function", () => {
  describe("When it receives a request with an incorrect username", () => {
    test("Then it should invoke the next function with an error", async () => {
      const myUsername = "tengoHambre";

      const req = {
        body: {
          username: myUsername,
        },
      };

      const res = {};

      User.findOne = jest.fn().mockResolvedValue(false);
      const error = new Error("Pssst! Wrong credentials.");
      error.code = 401;
      const next = jest.fn();

      await userLogin(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with an correct username and an incorrect password", () => {
    test("Then it should invoke the next function with an error", async () => {
      const req = {
        body: {
          username: "tengoHambre",
          password: "unaBuenaPassword",
        },
      };
      const res = {};
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue({
        username: "tengoHambre",
        password: "unaMalaPassword",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      const error = new Error("Pssst! Mistaken credentials!");
      error.code = 401;

      await userLogin(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });
});
