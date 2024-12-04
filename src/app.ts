import { RedisStore } from 'connect-redis';
import dotenv from 'dotenv'
import express, { Application } from 'express';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';
import MongoDBService from './config/database/mongodb/mongodb.config';
import RedisService from './config/database/redis/redis.config';
import { User } from './core/domain/entities/user.entity';
import { UserRepository } from './core/infrastructure/database/mongodb/user.repository';
import { AuthService } from './core/application/services/auth.service';
import { CreateUserDto } from './core/application/dto/create-user.dto';


//* load .env
dotenv.config();


//* initialize the app
const app: Application = express();
const PORT = process.env.PORT || 3000;

//* MongoDB Configuration
let mongoClient: MongoClient;


//* Redis Configuration
const redisClient = createClient({
    socket:{
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || "6379", 10)
    }
})

//* Redis Config For Session Store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:sess:"
})

//* Express Configuration
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//* Session Management
app.use(
    session({
        store: redisStore,
        secret: process.env.SESSION_SECRET || "defaultSessionSecret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure : false,
            httpOnly : true,
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        }
    })
)

//* MongoDB And Redis + Server Connection
const startApp = async (): Promise<void> =>{
    try {
        //* ========= MongoDB Connection =========
        const mongoService = MongoDBService.getInstance();
        await mongoService.connect();
        
        
        //* ========= Redis Connection =========
        const redisService = RedisService.getInstance();
        await redisService.connect();
        
        //* ========= Start Server =========
        app.listen(PORT,()=>{
            console.log(`Server is running on port : http://localhost:${PORT}`);
        })

        const authService = new AuthService();
        const userDto = new CreateUserDto("abolfazl","aslaniabolfazl86@gmail.com","151515")
        const result = await authService.register(userDto);
        console.log(result);
    } catch (error) {
        console.error("Error Starting The Application:", error);
        process.exit(1);
    }
}

//* Gracefull Shutdown
process.on('SIGINT',async ()=>{
    console.log("Shutting Down...");
    const mongoService = MongoDBService.getInstance();
    const redisService = RedisService.getInstance();
    
    await Promise.all([
        mongoService.disconnect(),
        redisService.disconnect(),
    ])
    process.exit(0);
})


startApp();