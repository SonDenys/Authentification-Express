// Import models
const User = require("../models/User");

const isAuthenticated = async (req, res, next) => {
  try {
    // Get back the token sent from the customer
    const token = req.headers.authorization.split(" ")[1];

    // Look for the user who have the token
    if (req.headers.authorization) {
      const user = await User.findOne({
        token: token,
      });

      // If not => Unauthorized
      if (!user) {
        return res
          .status(401)
          .json({ error: "Unauthorized, token not founded" });
      }
      // If we found the user (token)
      // We create a key 'user' in req. The route in which the middleware is called could access to req.user
      req.user = user;
      next();
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = isAuthenticated;
