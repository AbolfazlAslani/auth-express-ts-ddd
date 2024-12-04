import { RedisStore } from 'connect-redis';
import dotenv from 'dotenv'
import express, { Application } from 'express';
import session from 'express-session';
import { MongoClient } from 'mongodb';
import { createClient } from 'redis';


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
        mongoClient = new MongoClient(process.env.MONGO_DB_URI!)
        await mongoClient.connect();
        console.log("Conncted To MongoDB");
        
        //* ========= Redis Connection =========
        await redisClient.connect();
        console.log("Connected To Redis");
        
        //* ========= Start Server =========
        
        app.listen(PORT,()=>{
            console.log(`Server is running on port : http://localhost:${PORT}`);
        })

        
    } catch (error) {
        console.error("Error Starting The Application:", error);
        process.exit(1);
    }
}

startApp();