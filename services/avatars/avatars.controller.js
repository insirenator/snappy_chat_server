import Avatar from "./avatars.model.js";
import Payment from "./payments.model.js";
import PurchasedAvatar from "./purchasedAvatars.model.js";
import { nanoid } from "nanoid";
import Razorpay from "razorpay";
import crypto from "crypto";

import { config } from "dotenv";
config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
})

export const getFreeAvatars = async (req, res, next) => {
  try {
    const freeAvatars = await Avatar.find({ price: 0 });
    res.status(200).json({ status: true, data: freeAvatars });
  } catch (error) {
    next(error);
  }
};

export const getPremiumAvatars = async (req, res, next) => {
  try {
    const premiumAvatars = await Avatar.find({ price: { $ne: 0 } });
    res.status(200).json({ status: true, data: premiumAvatars });
  } catch (error) {
    next(error);
  }
};

export const getPurchasedAvatars = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const purchasedAvatars = await PurchasedAvatar.find({userId}).populate("avatarId");

    res.status(200).json({status: true, purchasedAvatars});
  } catch (error) {
    next(error);
  }
}

export const getOrder = async (req, res, next) => {
  const avatarId = req.params.id;

  try {
    const avatar = await Avatar.findById(avatarId);

    const options = {
      amount: avatar.price * 100,
      currency: "INR",
      receipt: nanoid(),
      payment_capture: 1,
    }

    const response = await razorpay.orders.create(options);
    // console.log(response);

    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const paymentVerification = async (req, res, next) => {
  try {
    const { 
      razorpay_payment_id, 
      razorpay_order_id,
      razorpay_signature } = req.body;

    const { avatarId, userId } = req.query;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if(isAuthentic) {

      // Store in DB
      await Payment.create({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      })

      await PurchasedAvatar.create({
        avatarId,
        userId,
      })


      res.redirect(`https://jazzy-fenglisu-c6d5a4.netlify.app/paymentSuccess?reference=${razorpay_payment_id}`);
    }
    else {
      res.status(400).json({ status: false });
    }
    

  } catch (error) {
    next(error);
  }
}
