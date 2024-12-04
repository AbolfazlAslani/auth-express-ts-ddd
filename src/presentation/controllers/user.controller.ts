import express,{ Request, Response, NextFunction } from 'express';
import { UserService } from '../../core/application/services/user.service';
import { verifyToken } from '../middlewares/auth-token.middleware';

const router = express.Router();

const userService = new UserService();
export class UserController{


  async profile(req: Request | any, res: Response, next: NextFunction){
    try {
    
      const userId = req.userId;
      const result = await userService.profile(userId!);
     
      res.status(200).json({
        result,
      });
    } catch (error) {
      next(error);
    }
  }

}


  

export default router;