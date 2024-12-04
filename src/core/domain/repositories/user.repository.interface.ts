// user.repository.interface.ts
import { User } from '../entities/user.entity';

export interface IUserRepository {
    insert(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(email: string): Promise<User | null>;
    
}
