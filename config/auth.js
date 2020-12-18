module.exports = {
  //Ensures users don't access the dashboard when logged out
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Login to access the dashboard");
    res.redirect("/login");
  },

  //Ensures users don't access the register/login page when logged in
  forwardAuth: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "You are already logged in!");
    res.redirect("/");
  },
};
