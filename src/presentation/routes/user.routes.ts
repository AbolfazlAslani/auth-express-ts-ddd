import express,{ Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middlewares/auth-token.middleware';
import { UserController } from '../controllers/user.controller';


const router = express.Router();
const userController = new UserController();
router.get('/profile',verifyToken,userController.profile)


export default router;