export interface JwtRefreshTokenPayload {
    userId: string;
    iat: number;
    exp: number
}
