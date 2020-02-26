const express = require("express");
// https://www.npmjs.com/package/bcrypt
const bcrypt = require("bcrypt");
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const cors = require("cors");
// http://knexjs.org/#Builder
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

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data =>
      bcrypt
        .compare(req.body.password, data[0].hash)
        .then(isValid => {
          if (isValid) {
            return db
              .select("*")
              .from("users")
              .where("email", "=", req.body.email)
              .then(user => res.json({ success: true, user: user[0] }))
              .catch(err =>
                res
                  .status(400)
                  .json({ success: false, errorMessage: "Unable to get user!" })
              );
          } else {
            return res
              .status(400)
              .json({ success: false, errorMessage: "Incorrect credentials!" });
          }
        })
        .catch(err =>
          res
            .status(400)
            .json({ success: false, errorMessage: "Incorrect credentials!" })
        )
    )
    .catch(err =>
      res
        .status(400)
        .json({ success: false, errorMessage: "Incorrect credentials!" })
    );
});

app.post("/register", (req, res) => {
  const { password, email, name } = req.body;

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      return res
        .status(400)
        .json({ success: false, errorMessage: "Unable to register!" });
    }

    // Store hash and email in login table, and add user to users table.
    return db
      .transaction(trx => {
        trx
          .insert({
            hash,
            email
          })
          .into("login")
          .returning("email")
          .then(loginEmail =>
            trx("users")
              // Will return all columns of insert
              .returning("*")
              .insert({ email: loginEmail[0], name, joined: new Date() })
              .then(users => {
                res.json({ success: true, user: users[0] });
              })
          )
          .then(trx.commit)
          // If anything fails rollback the changes.
          .catch(trx.rollback);
      })
      .catch(err =>
        res
          .status(400)
          .json({ success: false, errorMessage: "Unable to register!" })
      );
  });
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

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Error getting entries"));
});

app.listen(3001, () => {
  console.log("app is running on port 3001");
});
