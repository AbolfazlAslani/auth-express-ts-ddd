import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { HttpError } from '../../shared/httpError';

//* Error-handling middleware
export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
    } else {
        //* If its an unexpected error
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
