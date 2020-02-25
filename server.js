const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("This is working!");
});

app.listen(3000, () => {
  console.log("app is running on port 3000");
});

/*
Notes for endpoints
/ --> res = this is working
/signin --> POST success/ fail
/register --> POST = user
/profile/:userId --> GET = user (info)
/image --> PUT --> user (updated user data, count/ranking)
*/
