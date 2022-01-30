const VoucherModel = require('../../models/VoucherModel');
const CategoryModel = require('../../models/CategoryModel');
const TransactionModel = require('../../models/TransactionModel');
const NominalModel = require('../../models/NominalModel');
const BankModel = require('../../models/BankModel');
const PaymentModel = require('../../models/PaymentModel');

module.exports = {
  async landingPage(req, res) {
    try {
      const vouchers = await VoucherModel
        .find()
        .select(`
          _id name thumbnail active category
        `)
        .where({
          active: true
        })
        .populate('category');

      res.json({
        data: vouchers
      });
    } catch (e) {
      res.status(500).json({
        message: e.message || "Internal server error"
      });
    }
  },
  async detailPage(req, res) {
    try {
      const { id } = req.params;
      const voucher = await VoucherModel.findById(id)
        .populate('category', 'name -_id')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      if (!voucher) return res.status(404).json({
        message: "Voucher game is not found"
      });

      res.json(voucher);
    } catch (e) {
      res.status(500).json({
        message: e.message || "Internal server error"
      });
    }
  },
  async category(req, res) {
    const categories = await CategoryModel.find();

    return res.json({
      categories
    });
  },
  async checkout(req, res) {
    try {
      const { accountUser, name, nominalId, voucherId, paymentId, bankId } = req.body;

      const voucher = await VoucherModel.findById(voucherId)
        .select("_id name category thumbnail user")
        .populate('category')
        .populate('user');
      if (!voucher) return res.status(404).json({ message: "Voucher is not found" });

      const nominal = await NominalModel.findById(nominalId);
      if (!nominal) return res.status(404).json({ message: "Nominal is not found" });

      // payment
      const payment = await PaymentModel.findById(paymentId);
      if (!payment) return res.status(404).json({ message: "Payment is not found" });
      console.log({ payment });

      // bank
      const bank = await BankModel.findById(bankId);
      if (!bank) return res.status(404).json({ message: "Bank is not found" });
      // Based on policy tax is 10%
      const tax = (10 / 100) * nominal.price;
      const value = nominal.price - tax;

      const payload = {
        history: {
          voucher: {
            gameName: voucher.name,
            category: voucher.category.name,
            thumbnail: voucher.thumbnail,
          },
          nominal: {
            coinName: nominal.coinName,
            coinQuantity: nominal.coinQuantity,
            price: nominal.price
          },
          payment: {
            paymentType: payment.type,
            bankName: bank.bankName,
            bankAccountNumber: bank.bankAccountNumber
          },
          category: {
            name: voucher.category.name,
          },
          user: {
            name: voucher.user.name,
            phoneNumber: voucher.user.phoneNumber
          }
        },
        name,
        tax,
        value,
        category: voucher.category.id,
        player: req.player.id,
        user: null
      };

      const transaction = new TransactionModel(payload);
      await transaction.save();

      res.json({
        transaction
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e.message });
    }
  }
};