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
  }
};