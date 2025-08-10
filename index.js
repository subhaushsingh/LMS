import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit'
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();
const app = express();


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    message:'Too many requests, try later'
})
app.use(helmet());
app.use('/api',limiter);
app.use(hpp());
app.use(mongoSanitize());
app.use(cookieParser());


app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","PATCH","HEAD","OPTIONS"],
    allowedHeaders:[
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "device-remember-token",
        "Access-Control-Allow-Origin",
        "Origin",
        "Accept",
    ],
}));

app.use(express.json({limit:'10kb'}));
app.use(express.urlencoded({extended:true,limit:'10kb'}))

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use((err,req,res,next)=>{
    console.error(err.stack);
    res.status(err.status || 500).json({
        status:'error',
        message: err.message || 'internal server error',
        ...(process.env.NODE_ENV === 'development') && {stack:err.stack}
    })
})











const PORT = process.env.PORT;

app.listen(()=>{
    console.log(`server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
})