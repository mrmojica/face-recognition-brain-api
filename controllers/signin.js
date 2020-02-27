const handleSignin = (db, bcrypt) => (req, res) => {
  const { password, email } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, errorMessage: "Incorrect form submission!" });
  }

  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data =>
      bcrypt
        .compare(password, data[0].hash)
        .then(isValid => {
          if (isValid) {
            return db
              .select("*")
              .from("users")
              .where("email", "=", email)
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
