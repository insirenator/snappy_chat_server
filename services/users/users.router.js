import { Router } from "express";
import { getContacts, login, register, setAvatar } from "./users.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/contacts/:id", getContacts);

export default router;