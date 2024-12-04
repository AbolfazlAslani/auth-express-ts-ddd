import { rejects } from 'assert';
import dotenv from 'dotenv'
import { SignOptions } from 'jsonwebtoken';
import { resolve } from 'path';
import jwt from 'jsonwebtoken'

export class JwtService{
    private readonly defaultSecret: string;
    
    constructor(){
        this.defaultSecret = process.env.JWT_ACCESS_SECRET!;

    }

    
    
    async sign<T extends object>(payload: T, options: SignOptions,secret?: string): Promise<string>{
        const jwtSecret = secret ? secret: this.defaultSecret;
        
        return new Promise((resolve, reject) =>{
            jwt.sign(payload,jwtSecret,options,(err, token)=>{
                if (err){
                    reject(err)
                }else{
                    resolve(token as string)
                }
            })
        })
        
    }
    
    async verify<T extends object>(token: string, secret?: string): Promise<T | null> {
        const jwtSecret = secret ? secret: this.defaultSecret;
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded as T);
                }
            });
        });
    }

}