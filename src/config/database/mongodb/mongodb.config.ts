import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv'

dotenv.config();


class MongoDBService {
    private static instance: MongoDBService;
    private client!: MongoClient; 
    private database!: Db; 

    private constructor() {
        
    }

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

            this.client = new MongoClient(mongoUri);
            await this.client.connect();
            this.database = this.client.db(dbName);

            console.log(`Connected to MongoDB database: ${dbName}`);
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    //* Get the database instance
    public getDatabase(): Db {
        if (!this.database) {
            throw new Error('Database not initialized. Call connect() first.');
        }
        return this.database;
    }

    //* Close the MongoDB connection
    public async disconnect(): Promise<void> {
        if (this.client) {
            await this.client.close();
            console.log('MongoDB connection closed');
        }
    }
}

export default MongoDBService;
