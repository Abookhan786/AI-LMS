import {Router} from "express";
import { register , refreshToken, login ,logout } from "../controllers/authController";


const router = Router();


router.post("/register", register);
router.post("/login", login);
router.post("/refreshToken", refreshToken);
router.post("/logout", logout);


export default router;