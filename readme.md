# Auth App

This is an authentication application built using **TypeScript**, **DDD (Domain-Driven Design)**, **Express**, and **Joi validation**. The app utilizes **Redis** for managing access and refresh tokens, ensuring efficient and scalable session management. It also uses **Docker** for Redis and MongoDB services to simplify deployment and development setups.

## Features

- **Authentication**: Supports user authentication with access and refresh tokens.
- **Joi Validation**: Ensures data integrity by validating request bodies with Joi schemas.
- **Redis**: Redis is used for storing and managing JWT tokens.
- **Docker**: Docker is used to manage Redis and MongoDB, simplifying the deployment process.
- **TypeScript**: The application is written in TypeScript for better development experience and type safety.
- **Domain-Driven Design**: The application is structured using DDD principles to promote scalability and maintainability.

## Prerequisites

- **Docker**: Docker must be installed to run the Redis and MongoDB services.
- **Node.js**: The application requires Node.js and npm for running and building the app.

## Running the App

### 1. Set up Docker containers for Redis and MongoDB

The first step is to start Redis and MongoDB services using Docker. Run the following command:

```bash
docker-compose up -d
```

This will start both Redis and MongoDB in detached mode. Ensure that these services are up and running before proceeding.

### 2. Setting up the app

Once the Docker containers are running, you can choose to run the app in **development** or **production** mode.

#### For Development:

To run the app in development mode, use:

```bash
npm run start:dev
```

This will start the app with hot-reloading enabled using `ts-node`.

#### For Production:

To run the app in production mode, first build the application and then start it:

```bash
npm run build
npm run start
```

This will build the TypeScript code and start the server in production mode.

### 3. Sample `.env` file

Ensure that you have a `.env` file in the root of your project with the following content (this is a sample `.env` file when using Docker):

```env
# ===================== SERVER =====================
SERVER_PORT=4000

# ===================== DB =====================
MONGO_DB_URI=mongodb://root:password@localhost:27017/auth-app?authSource=admin
MONGO_DB_NAME=auth-app

# ===================== JWT =====================
JWT_ACCESS_SECRET=(YourAccessSecret)
JWT_REFRESH_SECRET=(YourRefreshSecret)

# ===================== REDIS =====================
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Install Dependencies

Before running the app, install the required dependencies using npm:

```bash
npm install
```

### 5. Running the Tests (optional)

If you have test cases for the app, you can run them using:

```bash
npm run test
```

## Project Structure

The project follows **Domain-Driven Design (DDD)**, and the structure is organized as follows:

- **src**
  - **core**: Contains the core application logic, including services and domain models.
  - **infrastructure**: Contains the database and other infrastructure-related code like Redis.
  - **presentation**: Contains Express controllers, routes, and middleware.
  - **shared**: Contains utility classes, such as custom errors.
  - **application**: Contains business logic and interacts with the database or external services.

## Technologies Used

- **TypeScript**: Strongly typed JavaScript for better maintainability and type safety.
- **Express**: Web framework for building RESTful APIs.
- **Joi**: Data validation library used for validating user input.
- **Redis**: In-memory data store for caching and token management.
- **MongoDB**: NoSQL database used for storing user data.
- **Docker**: Containerization platform used for running Redis and MongoDB services.
- **JWT (JSON Web Tokens)**: For secure user authentication using access and refresh tokens.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
