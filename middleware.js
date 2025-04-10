const isLoggedIn = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to create a new listing.");
    return res.redirect("/login");
  }
  next();
};

export default isLoggedIn;
