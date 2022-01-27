const VoucherModel = require('../../models/VoucherModel');
const CategoryModel = require('../../models/CategoryModel');

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
  }
};