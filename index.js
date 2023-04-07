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

// Import de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Routes Import
const userRoutes = require("./routes/user");
app.use(userRoutes);

const userTrips = require("./routes/trip");
app.use(userTrips);

app.get("/", async (req, res) => {
  res.json("Welcome to the API of HandleTrip");
});

app.all("*", (req, res) => {
  res.status(404).json({ message: "Page not found !" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Started");
});
