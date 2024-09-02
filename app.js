const express = require("express");
const app = express();
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require(`./model/user`);

app.set("views engine ", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("Register.ejs");
});

app.post("/register", async (req, res) => {
  const { fullName, age, username, email, password } = req.body;
  const findemail = await UserModel.findOne({ email });
  if (findemail) return res.send("email Already register");
  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(password, salt, async function (err, hash) {
      const user = await UserModel.create({
        fullName,
        age,
        username,
        email,
        password: hash,
      });
      const token = jwt.sign({ email: email, userid: user.id }, "memon");
      res.cookie("token", token);
      res.redirect("/profile");
    });
  });
});

app.get("/logout", (req, res) => {
  res.cookie("token", "");
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let EmailFind = await UserModel.findOne({ email });
  if (!EmailFind) return res.send("this email is not valid");
  bcrypt.compare(password, EmailFind.password, function (err, result) {
    if (result == true) {
      let token = jwt.sign({ email: email, userid: EmailFind.id }, "memon");
      res.cookie("token", token);
      res.redirect("/profile");
    }
  });
});

// function isLogenIn(req, res, next) {
//   if (req.cookies.token === " ") return res.redirect("/login");
//   else {
//     let decoded = jwt.verify(req.cookies.token, "memon");
//     req.user = decoded;
//   }
//   next();
// }

app.get("/profile", async (req, res) => {
  await res.send("hello");
});

app.listen(3000, function (err) {
  console.log("server is running on port 3000");
});
