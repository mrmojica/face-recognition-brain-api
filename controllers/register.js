const handleRegister = (req, res, db, bcrypt, saltRounds) => {
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
};

module.exports = {
  handleRegister
};
