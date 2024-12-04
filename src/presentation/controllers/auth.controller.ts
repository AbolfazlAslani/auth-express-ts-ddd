// presentation/controllers/auth.controller.ts
import express, { Request, Response, NextFunction } from 'express';
import { HttpError } from '../../shared/httpError';
import { AuthService } from '../../core/application/services/auth.service';
import { CreateUserDto } from '../../core/application/dto/create-user.dto';
import { LoginUserDto } from '../../core/application/dto/login.dto';

const router = express.Router();
const authService = new AuthService();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'johndoe'
 *               email:
 *                 type: string
 *                 example: 'johndoe@example.com'
 *               password:
 *                 type: string
 *                 example: 'securepassword123'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'User successfully created'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: 'johndoe'
 *               password:
 *                 type: string
 *                 example: 'securepassword123'
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Logged in successfully!'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid username or password
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: '60d22d4f9b1d8a44f5a4bb7a'
 *         username:
 *           type: string
 *           example: 'johndoe'
 *         email:
 *           type: string
 *           example: 'johndoe@example.com'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2024-12-04T12:34:56Z'
 */
 
 

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

//* login user route
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, password } = req.body;

        //* Create DTO
        const loginUserDto = new LoginUserDto(username, password);
        
        // * Call AuthService login method
        const user = await authService.login(loginUserDto);

        //* Return response if user logs in successfully
        res.status(200).json({
            message: 'Logged in successfully!',
            user,
        });
    } catch (error) {
        next(error); 
    }
});


export default router;
