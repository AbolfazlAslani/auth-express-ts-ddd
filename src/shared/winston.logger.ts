import winston from 'winston';


const logger = winston.createLogger({
  level: 'info',
  transports: [
    //* Log to the console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),

  ],
});

export default logger;
