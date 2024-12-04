import { HttpError } from "../../../shared/httpError";
import { User } from "../../domain/entities/user.entity";
import { UserRepository } from "../../infrastructure/database/mongodb/user.repository";
import { CreateUserDto } from "../dto/create-user.dto";
import { LoginUserDto } from "../dto/login.dto";

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
    }
}