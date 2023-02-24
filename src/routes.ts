import { Router } from "express";
import Auth from "./modules/auth";
import { isAuth } from "./middleware";
import Game from "./modules/game";

const router = Router();

router.get('/me', isAuth, Auth.controller.me)
router.post('/register', Auth.controller.register);
router.post('/authen', Auth.controller.authen)
router.post('/signout', isAuth, Auth.controller.signout)

router.get('/getPlayerData', Game.controller.all)
router.post('/updateResult', isAuth, Game.controller.update)

export default router