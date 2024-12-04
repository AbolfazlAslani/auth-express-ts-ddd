import express,{ Request, Response, NextFunction } from 'express';
import { UserService } from '../../core/application/services/user.service';
import { verifyToken } from '../middlewares/auth-token.middleware';

const router = express.Router();
const userService = new UserService();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User-related operations
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d22d4f9b1d8a44f5a4bb7a"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-04T12:34:56Z"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get(
    "/profile",
    verifyToken,
    async (req: Request | any, res: Response, next: NextFunction) => {
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
  );

  

export default router;