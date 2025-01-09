const express = require("express");
const jwt = require("jsonwebtoken");
const jwt_secret = "YashGawade";
const app = express();
app.use(express.json());

const users = [];

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  users.push({
    username: username,
    password: password,
  });
  res.json({ message: "You have been signed in" });

  console.log(users);
});

app.post("/signin", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  let founduser = null;
  for (let i = 0; i < users.length; i++) {
    if (username == users[i].username && password == users[i].password) {
      founduser = users[i];
    }
  }

  if (founduser) {
    const token = jwt.sign({ username }, jwt_secret);

    res.json({ token });
  }

  res.status(403).json({ message: "incorrect credentials" });
});

app.get("/me", function (req, res) {
  const token = req.header.authorization;
  const decodedInformation = jwt.verify({ token }, jwt_secret);
  const username = decodedInformation.username;

  let founduser = null;
  for (let i = 0; i < users.length; i++) {
    if (username == users[i].username) {
      founduser = users[i];
    }
  }
  if (founduser) {
    res.json({
      username: founduser.username,
      password: founduser.password,
    });
  } else {
    res.status(403).json({ message: "something went wrong" });
  }
});

app.listen(3000);
