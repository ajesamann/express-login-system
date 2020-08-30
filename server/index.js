//app dependencies
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const path = require("path");

//initialize the app
const app = express();

//connect to the mongoDB database
try {
  const uri =
    "mongodb+srv://aj:newpassword@cluster0.2lisg.mongodb.net/login_system?retryWrites=true&w=majority";
  mongoose.connect(
    uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("Connected to DB")
  );
} catch (error) {
  console.log("Could not connect to DB");
}

//middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(
  session({
    secret: "kasdnkjhdkasqewopixmsnax",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static(path.join(__dirname, "/../client")));
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

//mongoDB schema & model
const RegisterSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const RegisterModel = mongoose.model("Users", RegisterSchema);

//app routes
app.route("/register").post((req, res) => {
  //check to see if a user with the email and username requested already exists
  RegisterModel.find(
    { $or: [{ email: req.body.email }, { username: req.body.username }] },
    (err, result) => {
      if (result.length !== 0) {
        console.log("Username or email already taken!");
        res.end();
        return;
      } else {
        //if it doesn't exist, add a new user to the database
        const password = req.body.password;
        const saltRounds = 10;

        //hash the password
        bcrypt.hash(password, saltRounds, (err, hash) => {
          //create the user model for the registration, basically creating a user
          const user = new RegisterModel({
            email: req.body.email,
            username: req.body.username,
            password: hash,
          });

          //save the user to the database
          user.save((err, user) => {
            if (err) {
              return console.error(err);
            } else {
              console.log("Data saved to DB successfully");
            }
          });
        });

        res.end();
      }
    }
  );
});

app.route("/login").post((req, res) => {
  //check if the user is in the database, and that the login information matches
  RegisterModel.find(
    {
      username: req.body.username,
    },
    (err, result) => {
      //if the user exists, check to make sure the hashed password matches the password entered, then log the user in
      if (result.length == 1) {
        //grab the password from the DB
        const passwordInDB = result[0].password;
        //grab the password sent from the client
        const passwordSentByUser = req.body.password;
        //compare the hashed password to the password from the client
        bcrypt.compare(passwordSentByUser, passwordInDB, (err, match) => {
          if (err) console.log(err);
          //if the passwords match, log the user in, else show an error
          if (match !== true) {
            //show error
            console.log("Username or password is incorrect!");
          } else {
            //log the user in - *send them to their dashboard with their information
            req.session.username = result[0].username;
            req.session.email = result[0].email;
            return res.send("200");
          }
        });
      } else if (result.length == 0) {
        //the user does not exist in the database at all
        console.log("User doesn't exist!");
        res.send("404");
        return;
      }
    }
  );
});

app.route("/logout").get((req, res) => {
  if (req.session.username) {
    req.session.destroy();
  }
  res.send("200");
});

app.route("/dashboard").get((req, res) => {
  if (!req.session.username) {
    res.send("404");
    return;
  } else {
    res.json({ username: req.session.username, email: req.session.email });
  }
});

//turning the server on basically
app.listen(process.env.PORT || 3000, () => {
  console.log(`Listening on some port`);
});
