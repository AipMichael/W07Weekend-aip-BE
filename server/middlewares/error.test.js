/* const { ValidationError } = require("express-validation"); */
const { notFoundErrorHandler, errorHandler } = require("./error");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Given an notFoundErrorHandler middleware,", () => {
  describe("When it gets a request", () => {
    test("Then it should send a response with a 'Sorry, dead end.' error and a status code of 404", () => {
      const res = mockResponse();
      const expectedError = { error: "Sorry, dead end." };
      const req = {};

      notFoundErrorHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given an errorHandler middleware,", () => {
  describe("When it gets a request and an error and no error code", () => {
    test("Then it should send a response with a 'BOOM! All broken :(' error and a status code of 500", () => {
      const res = mockResponse();
      const error = { error: "BOOM! All broken :(" };
      const req = {};
      const next = () => {};

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
  describe("When it gets a request and a 'Who are you' error with a 401 error code", () => {
    test("Then it should send a response with the error's message and a status code of 401", () => {
      const res = mockResponse();
      const error = { message: "Who are you", code: 401 };
      const req = {};
      const next = () => {};

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
  describe("When it gets a request and a Validation error", () => {
    test("Then it should send a response with a 'Oh no! You've made a mistake!' message and a status code of 400", () => {
      const res = mockResponse();

      const ValidateError = () => new Error("Oh no! You've made a mistake!");

      const error = ValidateError();
      error.code = 400;
      const req = {};
      const next = () => {};

      errorHandler(error, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Oh no! You've made a mistake!",
      });
    });
  });
});
