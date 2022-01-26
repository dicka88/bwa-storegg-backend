const TransactionModel = require("../models/TransactionModel");

module.exports = {
  async index(req, res) {
    const transactions = await TransactionModel.find().sort({ _id: 1 });

    res.render('admin/transaction', {
      title: "Transaction",
      transactions,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async actionStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    try {
      // validate
      if (!['success', 'failed'].includes(status)) throw new Error("Status is not valid");

      await TransactionModel.findByIdAndUpdate(id, {
        status
      });

      req.flash('alertMessage', `Successfull update transaction`);
      req.flash('alertStatus', 'success');
    } catch (e) {
      req.flash('alertMessage', e.message);
      req.flash('alertStatus', 'success');
    }

    res.redirect('/transaction');
  }
}; 