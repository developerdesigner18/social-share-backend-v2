const passportService = require("./passport");
const passport = require("passport");

// Create the interceptor and ensure that the cookie is turned off
export const requireAuth = passport.authenticate("jwt", { session: false });
export const requireSignIn = passport.authenticate("local", { session: false });