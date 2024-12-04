declare namespace NodeJS{
    interface ProcessEnv{
        //* ===================== SERVER =====================
        SERVER_PORT: string;
        
        //* ===================== DB =====================
        MONGO_DB_URI: string;
        MONGO_DB_NAME: string;
        
        //* ===================== JWT =====================
        JWT_ACCESS_SECRET: string;
        JWT_REFRESH_SECRET: string;
        
        //* ===================== REDIS =====================
        REDIS_HOST: string; 
        REDIS_PORT: string;
        
        //* ===================== SESSION =====================
        SESSION_SECRET: string;
        
    }
}