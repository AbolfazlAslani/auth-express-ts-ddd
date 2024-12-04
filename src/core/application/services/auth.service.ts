import { HttpError } from "../../../shared/httpError";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../infrastructure/database/mongodb/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login.dto";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import RedisService from "../../../config/database/redis/redis.config";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { IJwtRefreshTokenPayloadDecoded } from "../../infrastructure/jwt/jwt-refresh-payload.interface";
import { JwtService } from "../../infrastructure/jwt/jwt.service";

dotenv.config()
export class AuthService{
    private userRepository = new UserRepository();
    
    
    //* Register User
    public async register(createUserDto: CreateUserDto): Promise<User>{
        //* DTO Validation
        const {error} = CreateUserDto.validate(createUserDto);
        if(error) {
            throw new HttpError(400,`Validation Error : ${error.message}`);
        }
        
        //* Check user existence via email
        const existingUserByEmail = await this.userRepository.findByEmail(createUserDto.email)
        if(existingUserByEmail){
            throw new HttpError(400,'User with this email already exists')
        }
        
        //* Check user existence via username
        const existingUserByUsername = await this.userRepository.findByUsername(createUserDto.username)
        if(existingUserByUsername){
            throw new HttpError(400,'User with this username already exists')
        }
        
        const createdUser = await User.create(
            createUserDto.username,
            createUserDto.email,
            createUserDto.password
        )

        
        //* Insert user in DB
        return await this.userRepository.insert(createdUser)
    }
    
    //* Login User
    public async login(loginUserDto: LoginUserDto){
    
        //* Validate user login form
        const {error} = LoginUserDto.validate(loginUserDto);
        
        if(error) {
            throw new HttpError(400,`Login failed : ${error.message}`);
        }
        
        //* Check user existence via username
        const existingUserByUsername = await this.userRepository.findByUsername(loginUserDto.username)
        if(!existingUserByUsername){
            throw new HttpError(401,'Incorrect username or password!')
        }
        
        //* Compare password
        const doesPasswordMatch = await User.comparePassword(loginUserDto.password,existingUserByUsername.password)
        if(!doesPasswordMatch){
            throw new HttpError(401,'Incorrect username or password!')
        }
        
        //* Initiliaze JWT Service
        const jwtService = new JwtService();
        
        //* Generate access token
        const accessToken = await jwtService.sign(
            {userId: existingUserByUsername.id, username: existingUserByUsername.username},
            {expiresIn: "6h"},
            process.env.JWT_ACCESS_SECRET!
        )
        
        //* Check if user already logged in (don't revoke the refresh token)
        let refreshToken = "";
        const checkUserLogin = await this.checkLogin(existingUserByUsername.id.toString())
        if(checkUserLogin){
            //* If user already logged in return the current refresh
            refreshToken = checkUserLogin;
        }else{
            //* create new refresh token
            refreshToken = await jwtService.sign(
                { userId: existingUserByUsername.id },
                { expiresIn: '7d' },
                process.env.JWT_REFRESH_SECRET!
            )
            //* Save the refresh token in Redis
            const redisClient = RedisService.getInstance().getClient();
            await redisClient.set(existingUserByUsername.id.toString(), refreshToken, {
                EX: 60 * 60 * 24 * 7, //* 7 days expiration (matching the refresh token's expiration)
            });
        }


        
        return {
            accessToken,
            refreshToken
        }
    }
    
    //* Check if user already logged in
    public async checkLogin(userId: string){
        const redisClient = RedisService.getInstance().getClient();
        return await redisClient.get(userId)
    }
    
    //* Refresh Token
    public async refreshToken(refreshTokenDto: RefreshTokenDto){
    
        //* Validate refresh token dto
        const {error} = RefreshTokenDto.validate(refreshTokenDto)
        if(error){
            throw new HttpError(400,error.message)
        }
        
        const {refreshToken} = refreshTokenDto
        try {
            //* Verify refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as IJwtRefreshTokenPayloadDecoded;
            
            //* Retrieve refresh token from redis
            const redisClient = RedisService.getInstance().getClient();
            return await redisClient.get(decoded.userId)

        } catch (error) {
            throw new  HttpError(400,"Invalid refresh token or expired")
        }
        
    }
}