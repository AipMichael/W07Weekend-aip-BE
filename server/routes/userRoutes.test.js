require("dotenv").config();
const debug = require("debug")("user:routes:tests");
const chalk = require("chalk");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const initializeDB = require("../../database");
const User = require("../../database/models/user");
const { initializeServer } = require("../index");
const { app } = require("../index");

jest.setTimeout(20000);

const request = supertest(app);

let server;
let token;
let passwords;
let myUsers;

beforeAll(async () => {
  await initializeDB(process.env.MONGO_DB_STRING_TEST);
  server = await initializeServer(process.env.SERVER_PORT_TEST);
});

beforeEach(async () => {
  myUsers = [
    {
      _id: "6191001dd254431e7f1983ec",
      name: "superHeroina",
      username: "heroine25",
      password: await bcrypt.hash("soySuperGuay", 10),
      image: "https://i.giphy.com/media/cMPdlbcUKl3xkMCyD3/giphy.webp",
      bio: "i am a heroine and i am the best and most powerful human ever.",
    },
    {
      _id: "6177001dd254431e7f1983ec",
      name: "triangulo",
      username: "trian9",
      password: await bcrypt.hash("soyEquilatera", 10),
      image: "https://i.giphy.com/media/ZgmpBF4fyqb7O/giphy.webp",
      bio: "triangles are my favorite shape",
    },
  ];
  await User.deleteMany();
  await User.create(myUsers[0]);
  await User.create(myUsers[1]);
  passwords = [myUsers[0].password, myUsers[1].password];
  const loginResponse = await request
    .post("/users/login")
    .send({ username: "heroine25", password: "soySuperGuay" })
    .expect(200);
  token = loginResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.on("close", () => {
    debug(chalk.greenBright("Connexion to database has been closed."));
  });
  await mongoose.connection.close();
  await server.on("close", () => {
    debug(chalk.greenBright("Connexion to server has been closed."));
  });
  await server.close();
});

describe("Given a /users router,", () => {
  describe("When it gets a POST request for /users/login with an existing username and a password", () => {
    test("Then it should send a response with a token and a status code of 200", async () => {
      const { body } = await request
        .post("/users/login")
        .send({ username: "heroine25", password: "soySuperGuay" })
        .expect(200);

      expect(body.token).toBeDefined();
    });
  });
  describe("When it gets a POST request for /users/login with a non existent username", () => {
    test("Then it should send a response with an error and a status code of 401", async () => {
      const { body } = await request
        .post("/users/login")
        .send({ username: "cualquierCosa", password: "unaMalaPassword" })
        .expect(401);

      const expectedError = {
        error: "Pssst! Wrong credentials.",
      };

      expect(body.token).not.toBeDefined();
      expect(body).toEqual(expectedError);
    });
  });

  describe("When it gets a POST request for /users/register without all the required fields", () => {
    test("Then it should send a response with an error and a status code of 401", async () => {
      const { body } = await request
        .post("/users/register")
        .send({
          username: "Descartes",
          password: "iDontCogito",
        })
        .expect(401);

      const expectedError = {
        error: "Oh no! You've made a mistake!",
      };

      expect(body).toEqual(expectedError);
    });
  });

  describe("When it gets a POST request for /users/register with all the required fields", () => {
    test("Then it should send a response with the new user and a status code of 200", async () => {
      const { body } = await request
        .post("/users/register")
        .send({
          username: "userita7",
          password: "contrasenaLinda",
          name: "quieroSerUsuaria",
        })
        .expect(200);

      expect(body).toHaveProperty("name", "quieroSerUsuaria");
    });
  });

  describe("When it gets a POST request for a non existing route", () => {
    test("Then it should send an error and a status code of 404", async () => {
      const { body } = await request
        .post("/users/registerbutwrong")
        .send({
          username: "userita7",
          password: "contrasenaLinda",
          name: "quieroSerUsuaria",
        })
        .expect(404);

      const expectedError = {
        error: "Sorry, dead end.",
      };

      expect(body).toEqual(expectedError);
    });
  });

  describe("When it gets a GET request for /users", () => {
    test("Then it should send a response with an array of users and a status code of 200", async () => {
      const { body } = await request
        .get("/users")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      const expectedLength = 2;
      const expectedUser1 = {
        id: "6191001dd254431e7f1983ec",
        name: "superHeroina",
        username: "heroine25",
        password: passwords[0],
        image: "https://i.giphy.com/media/cMPdlbcUKl3xkMCyD3/giphy.webp",
        bio: "i am a heroine and i am the best and most powerful human ever.",
        friends: [],
        enemies: [],
      };

      const expectedUser2 = {
        id: "6177001dd254431e7f1983ec",
        name: "triangulo",
        username: "trian9",
        password: passwords[1],
        image: "https://i.giphy.com/media/ZgmpBF4fyqb7O/giphy.webp",
        bio: "triangles are my favorite shape",
        friends: [],
        enemies: [],
      };
      expect(body).toHaveLength(expectedLength);
      expect(body).toContainEqual(expectedUser1);
      expect(body).toContainEqual(expectedUser2);
    });
  });
});
