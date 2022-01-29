const jwt = require("jsonwebtoken");
const config = require('../../config');

module.exports = {
  authenticate(req, res, next) {

    if (!req.session.user) {
      req.flash('alertMessage', "Please signin first");
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    }

    // make session accessable globally on view
    res.locals.session = req.session;
    res.locals.req = req;

    next();
  },
  jwtAuth(req, res, next) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      const data = jwt.verify(token, config.secretKey);

      req.player = data;

      next();
    } catch (err) {
      res.status(401).json({
        message: "Unauthorized"
      });
    }
  }
};