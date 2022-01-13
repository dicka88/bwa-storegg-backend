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

  },
  putDetail: async (req, res) => {

  }
}; 