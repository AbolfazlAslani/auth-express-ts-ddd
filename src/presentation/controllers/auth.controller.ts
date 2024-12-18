// presentation/controllers/auth.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../core/application/services/auth.service';
import { CreateUserDto } from '../../core/application/dto/create-user.dto';
import { LoginUserDto } from '../../core/application/dto/login.dto';
import { RefreshTokenDto } from '../../core/application/dto/refresh-token.dto';

const authService = new AuthService();







export class AuthController{

    //* Register user
    async register(req: Request, res: Response, next: NextFunction){
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
    }
    
    //* login user
    async login(req: Request, res: Response, next: NextFunction){
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
    }
    
    //* refresh user token
    async refreshToken(req: Request, res: Response, next: NextFunction){
        try {
            const { refreshToken } = req.body;
    
            //* Create DTO
            const refreshTokenDto = new RefreshTokenDto(refreshToken)
            
            // * Call AuthService refresh token method
            const result = await authService.refreshToken(refreshTokenDto);
    
    
            res.status(200).json({
                message: 'Token refreshed !',
                accessToken: result,
            });
        } catch (error) {
            next(error); 
        }
    }
}




