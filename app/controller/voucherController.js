const { uploader } = require("cloudinary").v2;

const { default: slugify } = require("slugify");
const CategoryModel = require("../models/CategoryModel");
const NominalModel = require("../models/NominalModel");
const VoucherModel = require("../models/VoucherModel");

module.exports = {
  async index(req, res) {
    const vouchers = await VoucherModel
      .find()
      .populate('category')
      .populate('nominals')
      .sort({ _id: 1 });

    res.render('admin/voucher', {
      title: "Voucher",
      vouchers,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async viewCreate(req, res) {
    const categories = await CategoryModel.find();
    const nominals = await NominalModel.find();

    res.render('admin/voucher/create', {
      title: "Create Voucher",
      categories,
      nominals,
      alert: {
        message: req.flash('alertMessage'),
        status: req.flash('alertStatus')
      }
    });
  },
  async postCreate(req, res) {
    try {
      const { name, category } = req.body;

      let thumbnail = null;

      if (req.file) {
        const filePath = 'public/uploads/' + req.file.filename;
        const resCloudinary = await uploader.upload(filePath);
        thumbnail = {
          asset_id: resCloudinary.asset_id,
          public_id: resCloudinary.public_id,
          bytes: resCloudinary.bytes,
          width: resCloudinary.width,
          height: resCloudinary.height,
          format: resCloudinary.format,
          created_at: resCloudinary.created_at,
          url: resCloudinary.url,
          secure_url: resCloudinary.secure_url,
          original_filename: resCloudinary.original_filename,
        };
      }

      const user = req.session.user.id;

      const slug = slugify(name, {
        lower: true,
        replacement: '-',
        trim: true
      });

      const voucher = new VoucherModel({ name, slug, thumbnail, category, user });

      await voucher.save();

      req.flash('alertMessage', `Successfull create voucher`);
      req.flash('alertStatus', 'success');

      res.redirect('/voucher');
    } catch (e) {
      console.log(e);
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async viewDetail(req, res) {
    const id = req.params.id;
    const categories = await CategoryModel.find();

    try {
      const voucher = await VoucherModel.findById(id)
        .populate('category')
        .populate('nominals');

      const nominals = voucher.nominals;

      if (!voucher) throw new Error("Voucher not found");

      res.render('admin/voucher/detail', {
        title: voucher.name + ' Voucher',
        voucher,
        categories,
        nominals,
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
    const { name, category } = req.body;

    try {
      const voucher = await VoucherModel.findById(id);

      if (!voucher) res.status(404).json({
        message: "Voucher is not found"
      });


      if (req.file) {
        const filePath = 'public/uploads/' + req.file.filename;
        const resCloudinary = await uploader.upload(filePath);

        voucher.thumbnail = {
          asset_id: resCloudinary.asset_id,
          public_id: resCloudinary.public_id,
          bytes: resCloudinary.bytes,
          width: resCloudinary.width,
          height: resCloudinary.height,
          format: resCloudinary.format,
          created_at: resCloudinary.created_at,
          url: resCloudinary.url,
          secure_url: resCloudinary.secure_url,
          original_filename: resCloudinary.original_filename,
        };
      }

      const slug = slugify(name, {
        lower: true,
        replacement: '-',
        trim: true
      });


      voucher.name = name;
      voucher.slug = slug;
      voucher.category = category;

      await voucher.save();

      req.flash('alertMessage', `Successfull update voucher`);
      req.flash('alertStatus', 'success');
      res.redirect('/voucher');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deleteVoucher(req, res) {
    const id = req.params.id;

    try {
      const result = await VoucherModel.findByIdAndDelete(id);

      req.flash('alertMessage', `Successfull remove voucher`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/voucher');
    }
  },
  async updateStatus(req, res) {
    const id = req.params.id;

    try {
      const voucher = await VoucherModel.findById(id);

      voucher.active = !voucher.active;
      await voucher.save();

      req.flash('alertMessage', `Successfull ${voucher.active ? 'Activated' : 'Deactivated'} voucher`);
      req.flash('alertStatus', 'success');
      res.redirect('/voucher');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('/voucher');
    }
  },
  async viewNominalDetail(req, res) {
    const { id, nominalId } = req.params;

    try {
      const nominal = await NominalModel.findById(nominalId);

      if (!nominal) throw new Error("Nominal not found");

      res.render('admin/nominal/detail', {
        title: nominal.name,
        id,
        nominal,
        alert: {
          message: req.flash('alertMessage'),
          status: req.flash('alertStatus')
        }
      });
    } catch (e) {
      res.status(404).render("errors/404", { title: "Not found" });
    }
  },
  async postNominal(req, res) {
    try {
      const { id } = req.params;
      const { coinQuantity, coinName, price } = req.body;

      const category = new NominalModel({ coinQuantity, coinName, price });

      await category.save();

      await VoucherModel.findByIdAndUpdate(id, {
        $push: {
          nominals: category.id
        }
      });

      req.flash('alertMessage', `Successfull create nominal`);
      req.flash('alertStatus', 'success');
      res.redirect('back');
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async updateNominal(req, res) {
    const { id, nominalId } = req.params;
    const { coinQuantity, coinName, price } = req.body;

    try {
      await NominalModel.findByIdAndUpdate(nominalId,
        { coinQuantity, coinName, price },
        { runValidators: true }
      );

      req.flash('alertMessage', `Successfull update nominal`);
      req.flash('alertStatus', 'success');
      res.redirect('/voucher/' + id);
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');
      res.redirect('back');
    }
  },
  async deleteNominal(req, res) {
    const { id, nominalId } = req.params;

    try {
      const result = await NominalModel.findByIdAndDelete(nominalId);

      await VoucherModel.findByIdAndUpdate(id, {
        $pull: {
          nominals: {
            _id: nominalId
          }
        }
      });

      req.flash('alertMessage', `Successfull remove nominal`);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher/' + id);
    } catch (e) {
      req.flash('alertMessage', `${e.message}`);
      req.flash('alertStatus', 'danger');

      res.redirect('back');
    }
  }
};