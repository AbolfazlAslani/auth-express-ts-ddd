// create-user.dto.ts
import Joi from 'joi';

export class CreateUserDto {
    username: string;
    email: string;
    password: string;

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public static validate(dto: CreateUserDto) {
        const schema = Joi.object({
            username: Joi.string().alphanum().min(3).max(30).required(),
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string()
                .min(8)
                .max(32)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
                .required(),
        });

        return schema.validate(dto);
    }
}
