module.exports = {
  authenticator: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirecate("/users/login");
  },
};
