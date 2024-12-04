import Joi from "joi";
import bcrypt from 'bcrypt'
import { BaseEntity } from "./base.entity";
import { ObjectId } from "mongodb";

export class User extends BaseEntity{
    constructor(
        public username: string,
        public email: string,
        public password: string,
    ){
        super()
        this.username = username;
        this.email = email;
        this.password = password;
        

    }
    //* Factory method to create and return a user with hashed password
    public static async create(
        username: string,
        email: string,
        password: string,
    ): Promise<User> {
    
        //* Automatically validate and hash the password, email, and username
        const emailValidation = User.validateEmail(email);
        if (emailValidation.error) {
            throw new Error(`Invalid email: ${emailValidation.error.message}`);
        }

        const usernameValidation = User.validateUsername(username);
        if (usernameValidation.error) {
            throw new Error(`Invalid username: ${usernameValidation.error.message}`);
        }

        const passwordValidation = User.validatePassword(password);
        if (passwordValidation.error) {
            throw new Error(`Invalid password: ${passwordValidation.error.message}`);
        }
        //* Hash password when creating user
        const hashedPassword = await User.hashPassword(password);

        return new User(username, email, hashedPassword);
    }
    
    
    //* Static methods for validation using joi
    public static validateEmail(email: string): Joi.ValidationResult<string>{
        const schema = Joi.string().email({tlds : {allow : false}})
        return schema.validate(email);
    }
    
    public static validatePassword(password: string): Joi.ValidationResult<string> {
        const schema = Joi.string()
            .min(8) 
            .max(32) 
            .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])')) //* Strong Password
            .required();
        return schema.validate(password);
    }

    public static validateUsername(username: string): Joi.ValidationResult<string> {
        const schema = Joi.string().alphanum().min(3).max(30).required();
        return schema.validate(username);
    }
    
    //* Static method to hash passwords
    public static async hashPassword(password: string): Promise<string> {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    //* Static method to compare passwords
    public static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}