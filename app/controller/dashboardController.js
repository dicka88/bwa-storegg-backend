const index = (req, res) => {
  res.render('admin/index', {
    title: "Dashboard"
  });
};

module.exports = {
  index
};