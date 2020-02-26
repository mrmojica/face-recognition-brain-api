const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "michaelmojica",
    password: "",
    database: "face-recognition-brain"
  }
});

const saltRounds = 10;

const app = express();

// Parse json
app.use(express.json());
// Enable CORS
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "Mike",
      email: "mike@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date()
    },
    {
      id: "1234",
      name: "Cindy",
      email: "cindy@gmail.com",
      password: "chocolate",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: "123",
      hash: "",
      email: "mike@gmail.com"
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  //   // Load hash from your password DB.
  //   bcrypt.compare(
  //     "cookies",
  //     "$2b$10$4v6BNf6WfmpEmSkQ8hN2aeOIir0PzKQBiewTlptHAB9zodJ8HvCjS",
  //     function(err, result) {
  //       // result == true
  //       console.log("first guess", result);
  //     }
  //   );
  //   bcrypt.compare(
  //     "donut",
  //     "$2b$10$4v6BNf6WfmpEmSkQ8hN2aeOIir0PzKQBiewTlptHAB9zodJ8HvCjS",
  //     function(err, result) {
  //       // result == false
  //       console.log("second guess", result);
  //     }
  //   );

  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  const { password, email, name } = req.body;

  //   bcrypt.hash(password, saltRounds, function(err, hash) {
  //     // Store hash in your password DB.
  //     console.log(hash);
  //   });

  db("users")
    // will returns all of the columns of insert
    .returning("*")
    .insert({ email, name, joined: new Date() })
    .then(users => {
      // should only return a single user
      res.json({ success: true, user: users[0] });
    })
    .catch(err =>
      res
        .status(400)
        .json({ success: false, errorMessage: "Unable to register!" })
    );
});

app.get("/profile/:id", (req, res) => {
  const id = req.params.id;

  db.select("*")
    .from("users")
    .where("id", id)
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Not found");
      }
    })
    .catch(err => res.status(400).json("Error getting user"));
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  const user = getUserById(id);

  if (user) {
    user.entries++;

    res.json(getUserById(id).entries);
  } else {
    res.status(400).json("user not found");
  }
});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});

const getUserById = id =>
  database.users.find(({ id: userId }) => userId === id);
