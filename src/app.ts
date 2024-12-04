import dotenv from 'dotenv'
import express, { Application } from 'express';
import MongoDBService from './config/database/mongodb/mongodb.config';
import RedisService from './config/database/redis/redis.config';
import router from './presentation/routes';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from './config/swagger.config';

//* load .env
dotenv.config();


//* initialize the app
const app: Application = express();
const PORT = process.env.SERVER_PORT || 3000;


//* Swagger Configuration
const swaggerSpec = swaggerJSDoc(swaggerOptions);


//* Express Configuration
app.use(express.json());
app.use(express.urlencoded({extended: true}));



//* MongoDB And Redis + Server Connection
const startApp = async (): Promise<void> =>{
    try {
        //* ========= MongoDB Connection =========
        const mongoService = MongoDBService.getInstance();
        await mongoService.connect();
        
        
        //* ========= Redis Connection =========
        const redisService = RedisService.getInstance();
        await redisService.connect();
        
        //* ========= Swagger UI =========
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
        
        //* ========= Start Server =========
        app.use(router)
        app.listen(PORT,()=>{
            console.log(`Server is running on port : http://localhost:${PORT}`);
            console.log(`Swagger Docs : http://localhost:${PORT}/api-docs`);
        })

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