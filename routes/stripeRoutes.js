import { Router } from "express";
import { createSession } from "../controllers/stripeController.js";

const router = Router();

router.post("/create-checkout-session", createSession);
router.get("/cancel", (req, res) => res.send("Cancel"));

export default router;
