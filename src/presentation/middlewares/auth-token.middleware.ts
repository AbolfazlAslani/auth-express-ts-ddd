// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import { createClient } from 'redis';
// import dotenv from 'dotenv';
// import RedisService from '../../config/database/redis/redis.config';


// dotenv.config();


// const redisClient = RedisService.getInstance().getClient()

// //* Middleware to authenticate access token
// export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

//     if (!token) {
//         return res.status(403).send('Access denied. No token provided.');
//     }

//     // Verify the access token
//     jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret', async (err, decoded) => {
//         if (err) {
//             // If token is expired or invalid, try refreshing with the refresh token
//             const refreshToken = req.cookies['refresh_token']; // Assuming refresh token is stored in cookies
//             if (!refreshToken) {
//                 return res.status(403).send('Invalid or expired token and no refresh token available.');
//             }

//             // Check if refresh token is in Redis (for validation)
//             const storedRefreshToken = await redisClient.get(`refresh_token:${refreshToken}`);
//             if (!storedRefreshToken) {
//                 return res.status(403).send('Invalid or expired refresh token.');
//             }

//             // Generate a new access token using the refresh token
//             try {
//                 const newAccessToken = generateAccessToken(decoded?.userId); // You can pass userId from the decoded payload
//                 return res.json({ accessToken: newAccessToken });
//             } catch (error) {
//                 return res.status(500).send('Failed to refresh token.');
//             }
//         }

//         // Attach user info to request
//         req.user = decoded;
//         next();
//     });
// };

// // Generate a new JWT access token
// export const generateAccessToken = (userId: string) => {
//     return jwt.sign({ userId }, process.env.JWT_SECRET || 'defaultSecret', {
//         expiresIn: '1h', // Token expiry time
//     });
// };

// // Handle user login, generate and store tokens
// export const login = async (req: Request, res: Response) => {
//     const { userId, password } = req.body; // Sample credentials, adjust as needed

//     // Authenticate the user (this is a simplified version, you should add real authentication logic here)
//     if (!userId || !password) {
//         return res.status(400).send('User ID and password are required.');
//     }

//     // Assuming authentication is successful and we have userId
//     const user = { userId }; // Mock user object

//     // Generate tokens
//     const accessToken = generateAccessToken(user.userId);
//     const refreshToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET || 'defaultSecret', {
//         expiresIn: '7d', // Refresh token expiry (longer lifetime)
//     });

//     // Store the refresh token in Redis with an expiry
//     await redisClient.set(`refresh_token:${refreshToken}`, user.userId, {
//         EX: 60 * 60 * 24 * 7, // Expiry time: 7 days
//     });

//     // Send the access token and set the refresh token in a cookie
//     res.cookie('refresh_token', refreshToken, {
//         httpOnly: true, // Protect from client-side access
//         secure: process.env.NODE_ENV === 'production', // Secure cookie in production
//         maxAge: 1000 * 60 * 60 * 24 * 7, // Refresh token expires in 7 days
//     });

//     res.json({ accessToken }); // Send the access token
// };

// // Handle logout
// export const logout = async (req: Request, res: Response) => {
//     const refreshToken = req.cookies['refresh_token'];

//     if (refreshToken) {
//         // Remove the refresh token from Redis to revoke it
//         await redisClient.del(`refresh_token:${refreshToken}`);
//     }

//     // Clear the cookie on the client-side
//     res.clearCookie('refresh_token');
//     res.send('Logged out successfully');
// };

