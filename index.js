const express = require("express");
const formidable = require("express-formidable");
const mongoose = require("mongoose");

const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const isAuthenticated = require("./middlewares/isAuthenticated");

require("dotenv").config();
const app = express();
app.use(formidable());
app.use(cors());

// Mongoose connect
mongoose.connect(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Routes Import
const userRoutes = require("./routes/user");
app.use(userRoutes);

app.get("/", async (req, res) => {
  res.json("Welcome to the API of MyTrooperS");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
