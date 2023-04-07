const mongoose = require("mongoose");

const Trip = mongoose.model("Trip", {
  localisation: {
    required: true,
    type: String,
  },
  event: String,
  date: Date,
  tripId: Number,
  // Link the type and the Trip because it's going to concern only the owner
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Trip;
