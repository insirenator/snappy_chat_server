import { Router } from "express";
import { getFreeAvatars, getOrder, getPremiumAvatars, getPurchasedAvatars, paymentVerification } from "./avatars.controller.js";

const router = Router();

router.get("/", getFreeAvatars);
router.get("/premium", getPremiumAvatars);
router.get("/purchasedAvatars/:userId", getPurchasedAvatars);

router.get("/purchase/:id", getOrder);
router.post("/paymentVerification", paymentVerification);

export default router;