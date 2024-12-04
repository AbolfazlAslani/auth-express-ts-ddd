import dotenv from 'dotenv'
import path from 'path';

dotenv.config()
//* Swagger configuration
export const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Auth app , Express + Typescript + DDD',
        version: '1.0.0',
        description: 'API documentation for the application',
      },
      servers: [
        {
          url: `http://localhost:${process.env.SERVER_PORT}`,
        },
      ],
    },
    apis: [path.join(__dirname, "..",'presentation', 'controllers','*.ts')],};