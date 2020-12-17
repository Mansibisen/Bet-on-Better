const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const methodOverride = require("method-override");
const app = express();

//Dotenv config
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//Passport config
require("./routes/passport-config")(passport);

//DB config
const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(function () {
    console.log("Mongo DB connected...");
  })
  .catch(function (err) {
    console.log(err);
  });

//Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

//Method override for PUT and DELETE
app.use(methodOverride("_method"));

//Express session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", require("./routes/index"));
app.use("/charity", require("./routes/charity"));

//Listening on localhost:5000 or environment variable PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
