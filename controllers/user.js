import User from "../model/user.js";

// sign up
export const signupUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    // console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to WanderLust !");
      res.redirect("/listings");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

// log in
export const loginUser = async (req, res) => {
  req.flash("success", "Welcome back!");

  const redirectUrl = req.session.redirectUrl || "/listings";

  res.redirect(redirectUrl);
};

// log out
export const logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You got logged out !");
    res.redirect("/listings");
  });
};
