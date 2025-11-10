import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js';
import userRouter from './routes/user.routes.js';
import messageRouter from './routes/message.routes.js';

export const app=express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// app.options(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));


app.use(express.json({limit: "16kb"})); 

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
})) 
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api/v2/auth",authRouter)
app.use("/api/v2/user",userRouter)
app.use("/api/v2/message",messageRouter)


app.use((err, req, res, next) => {
    console.error(err); // logs the error

    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    
    let errors = [];
  if (err.name === "ValidationError") {
    errors = Object.values(err.errors).map((el) => el.message);
  }
   
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors
    });
});


export default app