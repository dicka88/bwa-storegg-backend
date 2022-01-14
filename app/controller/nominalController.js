const { deleteOne } = require("../models/NominalModel");
const NominalModel = require("../models/NominalModel");

module.exports = {
  async index(req, res) {
    const nominals = await NominalModel.find().sort({ _id: 1 });

    res.render('admin/nominal', {
      title: "Nominal",
      nominals,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  viewCreate(req, res) {
    res.render('admin/nominal/create', {
      title: "Create Nominal",
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async postCreate(req, res) {
    try {
      const { coinQuantitiy, coinName, price } = req.body;

      const category = new NominalModel({ coinQuantitiy, coinName, price });

      await category.save();

      req.flash('alertMessage', `Successfull create nominal`);
      req.flash('alertStatus', 'success');
      res.redirect('/nominal');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;

    try {
      const category = await NominalModel.findById(id);

      if (!category) throw new Error("Nominal not found");

      res.render('admin/nominal/detail', {
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
    const { coinQuantitiy, coinName, price } = req.body;

    try {
      const update = await NominalModel.findByIdAndUpdate(id,
        { coinQuantitiy, coinName, price },
        { runValidators: true }
      );

      req.flash('alertMessage', `Successfull update nominal`);
      req.flash('alertStatus', 'success');
      res.redirect('/nominal');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deleteNominal(req, res) {
    const id = req.params.id;

    try {
      const result = await NominalModel.findByIdAndDelete(id);

      req.flash('alertMessage', `Successfull remove nominal`);
      req.flash('alertStatus', 'danger');
      res.redirect('/nominal');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/nominal');
    }
  }
};