import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
import logger from '../../../shared/winston.logger';

dotenv.config();

class MongoDBService {
    private static instance: MongoDBService;
    private client!: MongoClient; 
    private database!: Db; 

    private constructor() {}

    //* Get the instance
    public static getInstance(): MongoDBService {
        if (!MongoDBService.instance) {
            MongoDBService.instance = new MongoDBService();
        }
        return MongoDBService.instance;
    }

    //* Initialize the MongoDB connection
    public async connect(): Promise<void> {
        try {
            const mongoUri = process.env.MONGO_DB_URI;
            const dbName = process.env.MONGO_DB_NAME || 'defaultDb';

            if (!mongoUri) {
                throw new Error('MONGO_DB_URI is not defined in .env');
            }
            
            logger.info('Connecting to MongoDB...');
            this.client = new MongoClient(mongoUri);
            await this.client.connect();
            this.database = this.client.db(dbName);

            logger.info(`Connected to MongoDB database: ${dbName}`);
        } catch (error) {
            logger.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    //* Get the database instance
    public getDatabase(): Db {
        if (!this.database) {
            logger.error('Database is not initialized. Ensure connect() is called first.');
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.database;
    }

    //* Close the MongoDB connection
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            logger.info('MongoDB connection closed');
        }
    }
}

export default MongoDBService;
