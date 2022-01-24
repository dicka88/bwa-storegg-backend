const PaymentModel = require("../models/PaymentModel");
const BankModel = require("../models/BankModel");

module.exports = {
  async index(req, res) {
    const payments = await PaymentModel
      .find()
      .populate('banks')
      .sort({ _id: 1 });

    console.log({ payments });

    res.render('admin/payment', {
      title: "Payment",
      payments,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async viewCreate(req, res) {
    const banks = await BankModel.find();

    res.render('admin/payment/create', {
      title: "Create Payment",
      banks,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async postCreate(req, res) {
    try {
      const { type, banks } = req.body;

      const payment = new PaymentModel({ type, banks });

      await payment.save();

      req.flash('alertMessage', `Successfull create bank`);
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;
    const banks = await BankModel.find();

    try {
      const payment = await PaymentModel.findById(id)
        .populate('banks');

      if (!payment) throw new Error("Payment not found");

      res.render('admin/payment/detail', {
        title: payment.name + ' Payment',
        banks,
        payment,
        alert: {
          message: req.flash('alertMessage'),
          status: req.flash('alertStatus')
        }
      });
    } catch (e) {
      res.status(404).render("errors/404", { title: "Not found" });
    }
  },
  async putDetail(req, res) {
    const id = req.params.id;
    const { type, banks } = req.body;

    try {
      const update = await PaymentModel.findByIdAndUpdate(id,
        { type, banks },
        { runValidators: true }
      );

      req.flash('alertMessage', `Successfull update payment`);
      req.flash('alertStatus', 'success');
      res.redirect('/payment');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deletePayment(req, res) {
    const id = req.params.id;

    try {
      const result = await PaymentModel.findByIdAndDelete(id);

      req.flash('alertMessage', `Successfull remove payment`);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/payment');
    }
  },
  async updateStatus(req, res) {
    const id = req.params.id;

    try {
      const payment = await PaymentModel.findById(id);

      payment.status = !payment.status;
      await payment.save();

      req.flash('alertMessage', `Successfull ${payment.status ? 'Activated' : 'Deactivated'} payment`);
      req.flash('alertStatus', 'success');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

    }

    res.redirect('/payment');
  }
};