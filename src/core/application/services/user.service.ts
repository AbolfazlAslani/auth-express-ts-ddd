import { HttpError } from "../../../shared/httpError"
import { UserRepository } from "../../infrastructure/database/mongodb/user.repository"

export class UserService{
    private userRepository: UserRepository 
    
    constructor(){
        this.userRepository = new UserRepository()
    }
    
    public async profile(userId: string){
        const user = await this.userRepository.findById(userId)
        if(!user){
            throw new HttpError(404, "User not found!")
        }
        const {password, ...excludedUser} = user;
        
        return excludedUser;
    }
    
    
}