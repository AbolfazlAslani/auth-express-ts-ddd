import { ObjectId } from "mongodb";
import MongoDBService from "../../../../config/database/mongodb/mongodb.config";
import { User } from "../../../domain/entities/user.entity";
import { IUserRepository } from "../../../domain/repositories/user.repository.interface";

export class UserRepository implements IUserRepository{
    private db = MongoDBService.getInstance().getDatabase();
    private collectionName = "users";
    
    //* Insert new user to db
    public async insert(user: User): Promise<User>{
        const collection = this.db.collection(this.collectionName);
        
        const userDocument = {
            ...user,
            createdAt: new Date()
        }
        
        const result = await collection.insertOne(userDocument);
        
        const insertedUser = {
            ...user,
            id: result.insertedId.toString(),
            createdAt: new Date(),
        }
        return insertedUser;
    } 
    
    //* Find user by ID
    public async findById(id: string): Promise<User | null> {
        const collection = this.db.collection(this.collectionName);
        const result = await collection.findOne({ _id: new ObjectId(id) });
        if (result) {
            return new User(result.username, result.email, result.password); //* Map DB response to User entity
        }
        return null;
    }

    //* Find user by email
    public async findByEmail(email: string): Promise<User | null> {
        const collection = this.db.collection(this.collectionName);
        const result = await collection.findOne({ email });
        if (result) {
            return new User(result.username, result.email, result.password); //* Map DB response to User entity
        }
        return null;
    }
    
    //* Find user by email
    public async findByUsername(username: string): Promise<User | null> {
        const collection = this.db.collection(this.collectionName);
        const result = await collection.findOne({ username });
        if (result) {
            return new User(result.username, result.email, result.password); //* Map DB response to User entity
        }
        return null;
    }
}