// presentation/controllers/auth.controller.ts
import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpError';
import { AuthService } from '../../core/application/services/auth.service';
import { CreateUserDto } from '../../core/application/dto/create-user.dto';

const router = express.Router();
const authService = new AuthService();

//* Register user route
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        //* Create DTO
        const createUserDto = new CreateUserDto(username, email, password);

        // * Call AuthService register method
        const user = await authService.register(createUserDto);

        //* Return response if user is created successfully
        res.status(201).json({
            message: 'User successfully created',
            user,
        });
    } catch (error) {
        next(error); 
    }
});


export default router;
