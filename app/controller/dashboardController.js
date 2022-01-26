const PlayerModel = require("../models/PlayerModel");
const UserModel = require('../models/UserModel');
const VoucherModel = require('../models/VoucherModel');
const TransactionModel = require('../models/TransactionModel');

const index = async (req, res) => {
  const count = {
    player: await PlayerModel.countDocuments(),
    user: await UserModel.countDocuments(),
    transaction: await TransactionModel.countDocuments(),
    voucher: await VoucherModel.countDocuments()
  };

  res.render('admin/index', {
    title: "Dashboard",
    count,
    alert: {
      alreadyLogged: req.flash('alreadyLogged')
    }
  });
};

module.exports = {
  index
};