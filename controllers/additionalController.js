const { User, Topup } = require('../models');
const midtransClient = require('midtrans-client');

class additionalController {
  static async generateMidtransToken(req, res, next) {
    try {
      const { amount } = req.body;
      // let amount = 41111;
      if (!amount) {
        throw { name: 'AMOUNT_MUST_BE_FILLED' }
      }
      const findUser = await User.findByPk(req.user.id);

      const order = await Topup.create({
        amount,
        UserId: req.user.id,
        status: 'Pending',
      });

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: 'FOPY_TRX_' + order.id,
          gross_amount: order.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: findUser.email,
        },
      };

      const transaction = await snap.createTransaction(parameter);
      console.log(amount, transaction, `<<<<`);
      res.status(201).json(transaction);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  static async midtransCheck(req, res, next) {
    try {
      let { channel_response_message, gross_amount, order_id } = req.body;

      if (!channel_response_message || !gross_amount || !order_id) {
        throw { name: 'EMPTY_FIELD' } 
      }

      order_id = order_id.split('_');

      if (channel_response_message === 'Approved') {
        const topup = await Topup.findByPk(order_id[order_id.length - 1]);

        if (topup) {
          const user = await User.findByPk(topup.UserId);
          await User.update(
            {
              balance: user.balance + +gross_amount,
            },
            {
              where: {
                id: topup.UserId,
              },
            }
          );
          await Topup.update(
            { status: 'Completed' },
            {
              where: {
                id: topup.id,
              },
            }
          );
        } else {
          throw { name: 'PAYMENT_UNSUCCESSFULLY' };
        }
      }

      res.status(200).json({ message: 'Balance updated!' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = additionalController;
