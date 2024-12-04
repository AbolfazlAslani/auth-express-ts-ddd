import { ObjectId } from "mongodb";
import MongoDBService from "../../../../config/database/mongodb/mongodb.config";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface";

export class UserRepository implements IUserRepository {
    private collectionName = "users";

    //* Insert new user to db
    public async insert(user: User): Promise<User> {
        const db = MongoDBService.getInstance().getDatabase();
        const collection = db.collection(this.collectionName);
        
        const userDocument = {
            username: user.username,
            email: user.email,
            password: user.password,
            createdAt: user.createdAt,
        };

        const result = await collection.insertOne(userDocument);

        return new User(
            user.username,
            user.email,
            user.password,
            result.insertedId.toString() // Use insertedId from MongoDB response
        );
    }

    //* Find user by ID
    public async findById(id: string): Promise<User | null> {
        const db = MongoDBService.getInstance().getDatabase();  
        const collection = db.collection(this.collectionName);
        const result = await collection.findOne({ _id: new ObjectId(id) });

        if (result) {
            return new User(result.username, result.email, result.password,result._id.toString()); //* Map DB response to User entity
        }
        return null;
    }

    //* Find user by email
    public async findByEmail(email: string): Promise<User | null> {
        const db = MongoDBService.getInstance().getDatabase();  
        const collection = db.collection(this.collectionName);
        const result = await collection.findOne({ email });

        if (result) {
            return new User(result.username, result.email, result.password,result._id.toString()); //* Map DB response to User entity
        }
        return null;
    }

    //* Find user by username
    public async findByUsername(username: string): Promise<User | null> {
        const db = MongoDBService.getInstance().getDatabase(); 
        const collection = db.collection(this.collectionName);
        const result = await collection.findOne({ username });

        if (result) {
            return new User(result.username, result.email, result.password,result._id.toString()); //* Map DB response to User entity
        }
        return null;
    }
}
