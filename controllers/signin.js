const handleSignin = (req, res, db, bcrypt) => {
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
};

module.exports = {
  handleSignin
};
