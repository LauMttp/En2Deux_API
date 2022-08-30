const bcrypt = require("bcryptjs");
const jsonWebToken = require("jsonwebtoken");
const User = require("../models/User.model");
const router = require("express").Router();
const saltRounds = 10;

router.post("/signup", async (req, res, next) => {
  try {
    const { username, name, surname, password, genre, phoneNumber, email } =
      req.body;

    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res
        .status(401)
        .json({ message: "Username already exists. Try logging in instead." });
      return;
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    //console.log({ hashedPassword });

    const createdUser = await User.create({
      username,
      name,
      surname,
      password: hashedPassword,
      genre,
      phoneNumber,
      email,
    });

    res.status(201).json(createdUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const foundUser = await User.findOne({ username });

  if (!foundUser) {
    res.status(404).json({ message: "username does not exist" });
    return;
  }

  const isPasswordMatched = await bcrypt.compare(password, foundUser.password);
  if (!isPasswordMatched) {
    res.status(401).json({ message: "password does not match" });
    return;
  }

  const payload = { username };

  const authToken = jsonWebToken.sign(payload, process.env.TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  res.status(200).json(authToken);
});

module.exports = router;
