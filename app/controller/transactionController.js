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
  viewCreate(req, res) {
    res.render('admin/transaction/create', {
      title: "Create Transaction",
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async postCreate(req, res) {
    try {
      const { name } = req.body;

      const category = new TransactionModel({ name });

      await category.save();

      req.flash('alertMessage', `Successfull create category`);
      req.flash('alertStatus', 'success');
      res.redirect('/category');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;

    try {
      const category = await TransactionModel.findById(id);

      if (!category) throw new Error("Category not found");

      res.render('admin/category/detail', {
        title: category.name,
        category,
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
    const { name } = req.body;

    try {
      const update = await TransactionModel.findByIdAndUpdate(id, { name }, { runValidators: true });

      req.flash('alertMessage', `Successfull update category`);
      req.flash('alertStatus', 'success');
      res.redirect('/category');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deleteCategory(req, res) {
    const id = req.params.id;
    console.log({ id });
    try {
      const result = await TransactionModel.findByIdAndDelete(id);

      req.flash('alertMessage', `Successfull remove category`);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/category');
    }
  }
}; 