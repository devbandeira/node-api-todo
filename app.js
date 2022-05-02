
/* IMPORTS */
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// Config JSON response
app.use(express.json());

// Models
const User = require("./models/User");

// Open route - Public Route
app.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem vindo a nossa API" });
});

// Private Route
app.get("/user/:id", checkToken, async (req, res) => {

  const id = req.params.id;
  console.log(id + " esse e o meu id");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(typeof id)
    return res.status(404).json({ msg: "Usuario nao encontrado!" });
  }

  // Check if user exists
  const user = await User.findById(id, ["-password", "-_id"]); 
  if (!user) {
    return res.status(404).json({ msg: "Usuario nao encontrado!" });
  }

  res.status(200).json({msg: "Autenticado com sucesso", user})
});

// Middleware
function checkToken(req, res, next){
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(" ")[1];
  
  if(!token){
    return res.status(401).json({mgs: "Acesso negado"});
  };


  try {
    
    const secret = process.env.SECRET

    jwt.verify(token, secret);
     next()
  } catch (error) {
    
    res.status(400).json({msg: "Token invalido!"})

  }

};

// Register User
app.post("/auth/register", async (req, res) => {
  
  const { name, email, password, confirmPassword } = req.body;

  // Validations
  if (!name) {
    return res.status(422).json({ msg: "O nome e obrigatorio!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email e obrigatorio!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha e obrigatorio!" });
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ msg: "As senhas nao conferem" });
  }

  // Check if user exist
  const userExists = await User.findOne({ email: email });
  if (userExists) {
    return res
      .status(422)
      .json({ msg: "Usuario ja cadastrado, use outro email." });
  }

  // Create password Hash
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt); 

  // Create user 
  const user = new User({
    name,
    email,
    password: passwordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "Usuario criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error });
  }
});

// Login User
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validations
  if (!email) {
    return res.status(422).json({ msg: "O email e obrigatorio!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha e obrigatorio!" });
  }

  // Check if user exist
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "Usuario nao encontrado" });
  }

  // Check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(402).json({ msg: "Senha invalida!" });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticacao realizada com sucesso!", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Aconteceu um erro no servidor, tente novamente mais tarde!",
    });
  }
});

// Credentials
const dbUrl = process.env.DB_URL;

// Connect with DB
mongoose
  .connect(
    dbUrl
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectado ao BD com sucesso!");
  })
  .catch((error) => console.log(error));
