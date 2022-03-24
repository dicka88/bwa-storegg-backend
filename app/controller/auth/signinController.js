const bcrypt = require('bcryptjs');

const UserModel = require("../../models/UserModel");

module.exports = {
  index(req, res) {
    if (req.session.user) {
      req.flash('alreadyLogged', "You already logged, no need to signin again");
      return res.redirect('/dashboard');
    } 

    return res.render('admin/auth/signin', {
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async signinAction(req, res) {
    const { email, password } = req.body;

    try {
      const user = await UserModel.findOne({ email });

      if (!user) throw new Error("User with email is not found");

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) throw new Error("Email/password is not match");

      // Create session
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        loggedAt: new Date().toJSON()
      };

      return res.redirect('/dashboard');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      return res.redirect('/');
    }
  }
};