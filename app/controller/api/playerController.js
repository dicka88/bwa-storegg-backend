const VoucherModel = require('../../models/VoucherModel');
const CategoryModel = require('../../models/CategoryModel');
const TransactionModel = require('../../models/TransactionModel');
const NominalModel = require('../../models/NominalModel');
const BankModel = require('../../models/BankModel');
const PaymentModel = require('../../models/PaymentModel');
const { isValidObjectId, Types } = require('mongoose');
const PlayerModel = require('../../models/PlayerModel');
const config = require('../../../config');
const { uploader } = require('cloudinary').v2;
const jwt = require('jsonwebtoken');

const { ObjectId } = Types;

module.exports = {
  async landingPage(req, res) {
    try {
      const vouchers = await VoucherModel
        .find()
        .select(`
          _id name slug thumbnail active category
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

      const criteria = [
        { slug: id }
      ];

      if (isValidObjectId(id)) {
        criteria.push({
          _id: id
        });
      }

      const voucher = await VoucherModel.findOne({
        $or: criteria
      })
        .populate('category', 'name -_id')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      if (!voucher) return res.status(404).json({
        message: "Voucher game is not found"
      });

      const payment = await PaymentModel.find().populate('banks');

      res.json({
        voucher,
        payment
      });
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
      const { name, nominalId, voucherId, paymentId, bankId } = req.body;

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
        verifyId,
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
  },
  async history(req, res) {
    const playerId = req.player.id;
    const { status } = req.query;

    let criteria = {};

    // query status
    if (status) {
      criteria['status'] = status;
    }

    const transactions = await TransactionModel.find({ ...criteria, player: playerId }).sort({ _id: -1 });

    const totalNominal = transactions.reduce((prev, curr) => {
      return prev + curr.value;
    }, 0);

    res.json({
      total: totalNominal,
      transactions,
    });
  },
  async historyDetail(req, res) {
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(400).json({
      message: "Id is not valid"
    });

    const transaction = await TransactionModel.findById(id);

    if (!transaction) return res.status(404).json({
      message: "Transaction is not found"
    });

    res.json(transaction);
  },
  async dashboard(req, res) {
    const playerId = req.player.id;

    try {
      const count = await TransactionModel
        .aggregate([
          { $match: { player: ObjectId(playerId) } },
          {
            $group: {
              _id: "$category",
              value: {
                $sum: '$value'
              }
            }
          }
        ]);

      const categories = (await CategoryModel.find()).concat([]);

      count.forEach(async (item) => {
        const category = await categories.find(category => category._id = item._id);
        item.name = category?.name;
      });

      const transactions = await TransactionModel
        .find({ player: playerId })
        .populate('category')
        .sort({ createdAt: -1 });

      res.json({
        count,
        transactions
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal server error"
      });
    }
  },
  async profile(req, res) {
    try {
      const player = await PlayerModel.findById(req.player.id)
        .select(`
          id username name email avatar phoneNumber
        `);

      if (!player) return res.status(404).json({
        message: "Player is not found"
      });

      res.json(player);
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal server error"
      });
    }
  },
  async putProfile(req, res) {
    try {
      const { name, email, phoneNumber } = req.body;

      let additional = {};

      console.log(req.file);
      if (req.file) {
        const filePath = `public/uploads/${req.file.filename}`;

        const resCloudinary = await uploader.upload(filePath);
        additional.avatar = {
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

      await PlayerModel.findByIdAndUpdate(req.player.id, {
        name,
        email,
        phoneNumber,
        ...additional
      });

      const player = await PlayerModel.findById(req.player.id);

      const token = jwt.sign({
        id: player._id,
        username: player.username,
        email: player.email,
        name: player.name,
        avatar: player.avatar,
        phoneNumber: player.phoneNumber
      }, config.secretKey);

      res.json({
        data: player,
        token,
        message: "Profile has been changed"
      });
    } catch (err) {
      res.status(500).json({
        message: err.message || "Internal server error"
      });
    }
  }
};