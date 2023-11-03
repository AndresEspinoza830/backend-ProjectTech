import { Router } from "express";
import Stripe from "stripe";
import Producto from "../models/Producto.js";
import Usuario from "../models/Usuario.js";

const router = Router();

const stripe = new Stripe(
  "sk_test_51M4x5dDTT0xU9ozoBf8RseLTtr0lxT7FAEymAgcy99zVlryhKT2hVKzMhsXekmZZXngzvfofpE1uafPV0W1lVNVx0049R5Ohke"
);

router.post("/", async (req, res) => {
  try {
    const eventData = req.body;
    // console.log(eventData);

    if (eventData && eventData?.data) {
      if (eventData.type === "checkout.session.completed") {
        const sessionId = eventData?.data?.object?.id;

        const session = await stripe?.checkout?.sessions.retrieve(sessionId);

        // console.log(
        //   session.customer_details.email + " " + session.customer_details.name
        // );

        const productos = await stripe?.checkout?.sessions?.listLineItems(
          sessionId
        );
        // console.log(productos?.data[0]?.description);

        const instructivo = await Producto.findOne({
          nombre: productos?.data[0]?.description,
        });

        // console.log(instructivo);

        const usuario = await Usuario.findOne({
          email: session.customer_details.email,
        });

        if (!usuario.productos.includes(instructivo._id)) {
          usuario.productos.push(instructivo._id);
          await usuario.save();
        }
        res.status(200);
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
});

export default router;
