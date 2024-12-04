import Joi from 'joi';

export class LoginUserDto {
    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
    }

    public static validate(dto: LoginUserDto) {
        const schema = Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required(),
        });

        return schema.validate(dto);
    }
}
