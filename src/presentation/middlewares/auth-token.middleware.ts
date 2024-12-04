import dotenv from 'dotenv';
import {Request,Response,NextFunction} from 'express'
import { HttpError } from '../../shared/httpError';
import jwt from 'jsonwebtoken'
import { JwtService } from '../../core/infrastructure/jwt/jwt.service';
import { IJwtAccessTokenPayloadDecoded } from '../../core/infrastructure/jwt/jwt-access-payload.interface';

dotenv.config();

const accessTokenSecret = process.env.JWT_ACCESS_SECRET;

export const verifyToken = async (req: Request | any,res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new HttpError(401,'Authorization token missing or invalid');
        }
        
        //* Extract the token
        const token = authHeader.split(' ')[1];
        
        //* verify token
        const jwtService = new JwtService();
        const decoded = await jwtService.verify(token,accessTokenSecret) as IJwtAccessTokenPayloadDecoded;
        
        //* attach decoded to request
        
        req.userId = decoded.userId;
        
        next();
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new HttpError(401,'Invalid or expired token'));
        } else {
            next(error);
        }
    }
}