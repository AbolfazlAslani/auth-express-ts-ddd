import { createClient, RedisClientType } from 'redis';
import dotenv from "dotenv"

dotenv.config();
class RedisService {
    private static instance: RedisService; 
    private client!: RedisClientType; 

    private constructor() {
    }

    //* Get the instance
    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    //* Initialize the Redis connection
    public async connect(): Promise<void> {
        try {
            const host = process.env.REDIS_HOST || 'localhost';
            const port = parseInt(process.env.REDIS_PORT || '6379', 10);

            this.client = createClient({
                socket: {
                    host,
                    port,
                },
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
            });

            await this.client.connect();
            console.log(`Connected to Redis at ${host}:${port}`);
        } catch (error) {
            console.error('Error connecting to Redis:', error);
            throw error;
        }
    }

    //* Get the Redis client instance
    public getClient(): RedisClientType {
        if (!this.client) {
            throw new Error('Redis client not initialized. Call connect() first.');
        }
        return this.client;
    }

    //* Close the Redis connection
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.quit();
            console.log('Redis connection closed');
        }
    }
}

export default RedisService;
