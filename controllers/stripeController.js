import Stripe from "stripe";

const stripe = new Stripe(
  "sk_test_51M4x5dDTT0xU9ozoBf8RseLTtr0lxT7FAEymAgcy99zVlryhKT2hVKzMhsXekmZZXngzvfofpE1uafPV0W1lVNVx0049R5Ohke"
);

const createSession = async (req, res) => {
  const { nombre, precio, _id } = req.body;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: {
            name: nombre,
            description: _id,
          },
          currency: "usd",
          unit_amount: precio * 100, //200.00
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "https://profound-kitsune-bac623.netlify.app/compra-exitosa",
    cancel_url: "http://localhost:8800/api/cancel",
  });
  return res.json(session);
};

export { createSession };
