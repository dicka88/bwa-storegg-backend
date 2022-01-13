const CategoryModel = require("../models/categoryModel");

module.exports = {
  index: async (req, res) => {
    const categories = await CategoryModel.find();

    console.log(categories);

    res.render('admin/category', {
      title: "Category",
      categories
    });
  },
  viewCreate: (req, res) => {
    res.render('admin/category/create', {
      title: "Create Category"
    });
  },
  postCreate: async (req, res) => {
    try {
      const { name } = req.body;

      const category = await CategoryModel({ name });
      await category.save();

      res.redirect('/category');

    } catch (e) {

    }
  },
  viewDetail: async (req, res) => {
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
  putDetail: async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    try {
      const update = await CategoryModel.updateOne({ id }, { name }, { runValidators: true });

      console.log(update);

      res.redirect('/category');

    } catch (e) {
      res.status(404);

    }
  }
}; 