import { Router } from 'express';
import authController from '../controllers/auth.controller';
import userRoute from './user.routes'
import { errorHandler } from '../middlewares/error.middleware';


const router = Router();

//* Register all routes
router.use('/auth', authController);
router.use('/user', userRoute);


//* Error-handling middleware
router.use(errorHandler);

export default router;
