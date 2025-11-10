import express from 'express'
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './src/database/db.js';
import { app,server } from './socket/socket.js';

connectDB()
.then(()=>{
    server.listen(process.env.PORT || 8000, ()=>{
        console.log(`server is running at port: ${process.env.PORT}`);
    });
})
.catch((err)=>{
    console.log("MongoDB connection error: ", err);
})

