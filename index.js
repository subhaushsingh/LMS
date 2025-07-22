import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';


dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.listen(()=>{
    console.log(`server is running at ${PORT} in ${process.env.NODE_ENV} mode`);
})