// loads environment variables from a .env file into process.env.
require("dotenv").config();
const express = require("express");
// https://www.npmjs.com/package/bcrypt
const bcrypt = require("bcrypt");
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cors = require("cors");
// http://knexjs.org/#Builder
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const image = require("./controllers/image");
const profile = require("./controllers/profile");

const db = knex({
  client: "pg",
  // Connect to Heroku DB
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

const saltRounds = 10;

const app = express();

// Parse json
app.use(express.json());
// Enable CORS
app.use(cors());

app.get("/", (req, res) => res.json("server is working!"));

app.post("/register", register.handleRegister(db, bcrypt, saltRounds));

app.post("/signin", signin.handleSignin(db, bcrypt));

app.put("/image", image.handleImage(db));
app.post("/imageUrl", (req, res) => image.handleClarafaiAPICall(req, res));

app.get("/profile/:id", profile.handleProfileGet(db));

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
