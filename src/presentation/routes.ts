import { Router } from 'express';
import authController from './controllers/auth.controller';
import userController from './controllers/user.controller'
import { errorHandler } from './middlewares/error.middleware';


const router = Router();

//* Register all routes
router.use('/auth', authController);
router.use('/user', userController);


//* Error-handling middleware
router.use(errorHandler);

export default router;
