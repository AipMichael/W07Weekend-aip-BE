require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const { userLogin, userSignUp } = require("./userControllers");

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
  describe("When it receives a request with an correct username and password", () => {
    test("Then it should invoke res.json with an object with a token", async () => {
      const req = {
        body: {
          username: "tengoHambre",
          password: "unaBuenaPassword",
        },
      };
      const res = {
        json: jest.fn(),
      };

      User.findOne = jest.fn().mockResolvedValue({
        username: "tengoHambre",
        password: "unaBuenaPassword",
      });

      bcrypt.compare = jest.fn().mockResolvedValue(true);
      const expectedtoken = "tokenSerioYReal";
      jwt.sign = jest.fn().mockReturnValue(expectedtoken);

      const expectedResponse = {
        token: expectedtoken,
      };

      await userLogin(req, res);

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });
});

describe("Given an userSignUp function", () => {
  describe("When it receives a request with an existing username", () => {
    test("Then it should invoke the next function with an error", async () => {
      const myUsername = "superHeroina";

      const req = {
        body: {
          username: myUsername,
        },
      };

      const res = {};

      User.findOne = jest.fn().mockResolvedValue(true);
      const error = new Error("Sorry. This username already exists.");
      error.code = 400;
      const next = jest.fn();

      await userSignUp(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
      expect(next.mock.calls[0][0]).toHaveProperty("code", error.code);
    });
  });

  describe("When it receives a request with a new username", () => {
    test("Then it should respond with the new user", async () => {
      const myUser = {
        name: "superHeroina",
        username: "heroine25",
        password: "soySuperGuay",
        image: "https://i.giphy.com/media/cMPdlbcUKl3xkMCyD3/giphy.webp",
        bio: "i am a heroine and i am the best and most powerful human ever.",
      };

      const req = {
        body: myUser,
      };

      const res = {
        json: jest.fn(),
      };

      User.findOne = jest.fn().mockResolvedValue(false);

      await userSignUp(req, res);

      expect(res.json).toHaveBeenCalledWith(myUser);
    });
  });
});
