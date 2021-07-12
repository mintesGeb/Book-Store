const User = require("../model/userModel");
const jwt = require("jsonwebtoken");

const secret = "top-secret";

exports.login = (req, res, next) => {
  const newUser = new User(
    req.body.username,
    req.body.password,
    req.body.role
  ).login();
  if (newUser) {
    //generateToken
    let token = jwt.sign(
      { username: newUser.username, role: newUser.role },
      secret
    );
    res.json({ token });
  } else {
    res.json({ error: "invalid username or password" });
  }
};

exports.authorize = (req, res, next) => {
  const header = req.headers.authorization;
  if (header) {
    try {
      const payload = jwt.verify(header.split(" ")[1], secret);
      req.user = payload;
      console.log(payload);
      next();
    } catch (err) {
      res.status(403).json({ error: "forbidden" });
    }
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
};

exports.authorizeAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(401).json({ error: "unauthorized" });
  }
};
