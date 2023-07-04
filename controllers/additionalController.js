// https://github.com/PLhery/node-twitter-api-v2/tree/master
// router.post("/login", twitterController.twitterLogin);
// router.post("/callback", twitterController.twitterCallback);
// router.post('/google/login', Controller.googleLogin)
// router.post("/generate-payment", Controller.generateMidtransToken);

const { signToken } = require('../helpers/jwt');
const { User } = require('../models');
const { TwitterApi } = require('twitter-api-v2');
const midtransClient = require("midtrans-client");
const { OAuth2Client } = require('google-auth-library');
let o_t_secret;
let twitterUsername;

class additionalController {
  static async twitterLogin(req, res, next) {
    try {
      const client = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET,
      });

      const authLink = await client.generateAuthLink(
        // "https://galicat-official.web.app/login"
        'http://localhost:5173/login'
      );

      const link = authLink.url;
      o_t_secret = authLink.oauth_token_secret;

      res.json(link);
    } catch (error) {

      next(error);
    }
  }
  static async twitterCallback(req, res, next) {
    try {
      const { oauth_token, oauth_verifier } = req.query;

      if (!oauth_token || !oauth_verifier || !o_t_secret) {
        return res
          .status(400)
          .send('You denied the app or your session expired!');
      }

      const client = new TwitterApi({
        appKey: process.env.TWITTER_APP_KEY,
        appSecret: process.env.TWITTER_APP_SECRET,
        accessToken: oauth_token,
        accessSecret: o_t_secret,
      });

      let {
        client: loggedClient,
        accessToken,
        accessSecret,
      } = await client.login(oauth_verifier);

      const v1 = await loggedClient.currentUser();
      const v2 = await loggedClient.currentUserV2();
      twitterUsername = v2.data.username; // dntqtqt

      const [user, created] = await User.findOrCreate({
        where: { email: twitterUsername + '@gmail.com' },
        defaults: {
          username: twitterUsername,
          email: twitterUsername + '@gmail.com',
          password: '123456',
          isSubscribed: false,
          isVerified: true,
        },
        hooks: false,
      });

      const access_token = signToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });

      res.status(200).json({
        id: user.id,
        access_token: access_token,
        username: user.username,
        email: user.email,
      });
    } catch (error) {

      next(error);
    }
  }
  static async generateMidtransToken(req, res, next) {
    try {
      const findUser = await User.findByPk(req.user.id);
      // const findUser = await User.findByPk(4)

      if (findUser.isSubscribed) throw { name: "ALREADY_SUBS" };

      let snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id:
            "FOPY_TX_" + Math.floor(1000000 + Math.random() * 4900000),
          gross_amount: 10000,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          // "first_name": "budi",
          // "last_name": "pratama",
          email: findUser.email,
          // "phone": "08111222333"
        },
      };

      const transaction = await snap.createTransaction(parameter);
      res.status(201).json(transaction);
    } catch (error) {
      next(error);
    }
  }
  static async googleLogin(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: req.headers.google_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      const [user, created] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: payload.name,
          email: payload.email,
          password: '123456',
          isSubscribed: false,
          isVerified: true
        },
        hooks: false
      });

      const access_token = createToken({
        id: user.id,
        username: user.username,
        email: user.email,
      })

      res.status(200).json({
        id: user.id,
        access_token: access_token,
        username: user.username,
        email: user.email,
      })

    } catch (error) {
      next(error)
    }
  }
}

module.exports = additionalController;
