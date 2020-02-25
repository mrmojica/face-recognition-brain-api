const express = require("express");

const app = express();

// parse json
app.use(express.json());

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
      email: "Cindy@gmail.com",
      password: "chocolate",
      entries: 0,
      joined: new Date()
    }
  ]
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("succcess");
  } else {
    res.status(400).json("error logging in");
  }
});

app.post("/register", (req, res) => {
  database.users.push({
    id: "1235",
    entries: 0,
    joined: new Date(),
    ...req.body
  });

  res.json(database.users[database.users.length - 1]);
});

app.get("/profile/:id", (req, res) => {
  const id = req.params.id;
  const user = getUserById(id);

  if (user) {
    res.json(user);
  } else {
    res.status(400).json("user not found");
  }
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

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

const getUserById = id =>
  database.users.find(({ id: userId }) => userId === id);
