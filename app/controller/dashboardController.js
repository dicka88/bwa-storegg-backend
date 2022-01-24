const index = (req, res) => {
  res.render('admin/index', {
    title: "Dashboard",
    alert: {
      alreadyLogged: req.flash('alreadyLogged')
    }
  });
};

module.exports = {
  index
};