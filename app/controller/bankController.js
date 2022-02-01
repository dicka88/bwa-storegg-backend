const CategoryModel = require("../models/CategoryModel");
const BankModel = require("../models/BankModel");

module.exports = {
  async index(req, res) {
    const banks = await BankModel
      .find()
      .sort({ _id: 1 });

    res.render('admin/bank', {
      title: "Banks",
      banks,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async viewCreate(req, res) {

    res.render('admin/bank/create', {
      title: "Create Bank Account",
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async postCreate(req, res) {
    try {
      const { name, bankName, bankAccountNumber } = req.body;

      let thumbnail = null;

      if (req.file) {
        thumbnail = req.file.filename;
      }

      const voucher = new BankModel({ name, bankName, bankAccountNumber });

      await voucher.save();

      req.flash('alertMessage', `Successfull create bank`);
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;

    try {
      const bank = await BankModel.findById(id);

      if (!bank) throw new Error("Bank not found");

      res.render('admin/bank/detail', {
        title: bank.name + ' Bank',
        bank,
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
    const { name, bankName, bankAccountNumber } = req.body;

    try {
      await BankModel.findByIdAndUpdate(id,
        { name, bankName, bankAccountNumber },
        { runValidators: true }
      );

      req.flash('alertMessage', `Successfull update bank`);
      req.flash('alertStatus', 'success');
      res.redirect('/bank');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deleteBank(req, res) {
    const id = req.params.id;

    try {
      await BankModel.findByIdAndDelete(id);

      req.flash('alertMessage', `Successfull remove bank`);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/bank');
    }
  }
};