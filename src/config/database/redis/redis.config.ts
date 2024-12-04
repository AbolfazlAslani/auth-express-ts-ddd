import { createClient, RedisClientType } from 'redis';
import dotenv from "dotenv"
import logger from '../../../shared/winston.logger';

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
                logger.error('Redis Client Error:', err);
            });

            await this.client.connect();
            logger.info(`Connected to Redis at ${host}:${port}`);
        } catch (error) {
            logger.error('Error connecting to Redis:', error);
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
            logger.info('Redis connection closed');
        }
    }
}

export default RedisService;
