import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

//* Swagger configuration
export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth App - Express + Typescript + DDD',
      version: '1.0.0',
      description: 'This API has been developed by Abolfazl Aslani',
    },
    servers: [
      {
        url: `http://localhost:${process.env.SERVER_PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    }
    
  },
  apis: [path.join(__dirname, '..', 'presentation', 'controllers',"**" ,'*.ts')],
};
