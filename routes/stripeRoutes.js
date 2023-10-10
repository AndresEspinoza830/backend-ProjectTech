import { Router } from "express";
import Stripe from "stripe";

const router = Router();

router.post("/checkout", async (req, res) => {
  const { id, amount } = req.body;
  try {
    const stripe = new Stripe(process.env.STRIPE_API_KEY_PRIVATE);

    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "USD",
      description: "Redes WI-FI",
      payment_method: id,
      confirm: true,
      return_url: process.env.FRONTEND_URL + "/home",
    });

    console.log(payment);
    res.send({ msg: "Seccesfll payment" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

export default router;
