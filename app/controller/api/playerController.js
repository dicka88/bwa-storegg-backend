const VoucherModel = require('../../models/VoucherModel');

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
        message: e.message || "System error"
      });
    }
  }
};