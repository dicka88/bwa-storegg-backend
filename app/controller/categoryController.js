const CategoryModel = require("../models/CategoryModel");

module.exports = {
  async index(req, res) {
    const categories = await CategoryModel.find();

    console.log(categories);

    res.render('admin/category', {
      title: "Category",
      categories
    });
  },
  viewCreate(req, res) {
    res.render('admin/category/create', {
      title: "Create Category"
    });
  },
  async postCreate(req, res) {
    try {
      const { name } = req.body;

      const category = new CategoryModel({ name });

      await category.save();

      res.redirect('/category');

    } catch (e) {
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;

    try {
      const category = await CategoryModel.findById(id);

      if (!category) throw new Error("Category not found");

      res.render('admin/category/detail', {
        title: category.name,
        category
      });
    } catch (e) {
      res.status(404).render("errors/404", { title: "Not found" });
      console.log(e);
    }

  },
  async putDetail(req, res) {
    const id = req.params.id;
    const { name } = req.body;

    try {
      const update = await CategoryModel.updateOne({ id }, { name }, { runValidators: true });

      console.log(update);

      res.redirect('/category');

    } catch (e) {
      res.status(404);

    }
  },
  async deleteCategory(req, res) {
    const id = req.params.id;
    console.log({ id });
    try {
      const result = await CategoryModel.findByIdAndDelete(id);

      res.redirect('/category');
    } catch (e) {
      console.log({ e });
    }
  }
}; 