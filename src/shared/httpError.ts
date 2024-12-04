export class HttpError extends Error {
    public statusCode: number;
    public message: string;
    public details?: any;

    constructor(statusCode: number, message: string, details?: any) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;

        // Capture stack trace (for debugging purposes)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, HttpError);
        }
    }
}
