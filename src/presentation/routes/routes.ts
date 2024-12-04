import { Router } from 'express';
import authRoute from './auth.routes';
import userRoute from './user.routes'
import { errorHandler } from '../middlewares/error.middleware';
import { verifyToken } from '../middlewares/auth-token.middleware';


const router = Router();

//* Register all routes
router.use('/auth', authRoute);
router.use('/user',verifyToken ,userRoute);


//* Error-handling middleware
router.use(errorHandler);

export default router;
