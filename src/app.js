const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const passport = require("passport");
const bodyParser = require("body-parser");
const passportJwtStrategy = require("./PassportJwtStrategy");
const router = require("./router");

const app = express();

// MongoDB connection
mongoose
  .connect("mongodb://db:27017/bookswap", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(error => {
    console.log(error);
  });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://bookswap.ro"
        : "http://localhost:8080"
  })
);

app.use(passport.initialize());
passport.use(passportJwtStrategy);
app.use(passport.authenticate("jwt", { session: false }));
// API ROUTES
app.use(router);

// Error handler
app.use((err, req, res, next) => {
  // Log error message in our server's console
  console.error(process.env.NODE_ENV === "production" ? err.message : err);

  // If err has no specified error code, send status 500 'Internal Server Error'
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode).json({ message: err.message });
  next();
});

module.exports = app;
