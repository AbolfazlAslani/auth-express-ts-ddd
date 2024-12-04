import Joi from 'joi';

export class RefreshTokenDto {
    refreshToken: string;

    constructor(refreshToken: string) {
        this.refreshToken = refreshToken;
    }

    public static validate(dto: RefreshTokenDto) {
        const schema = Joi.object({
            refreshToken: Joi.string().required(),
        });

        return schema.validate(dto);
    }
}
