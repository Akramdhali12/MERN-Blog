import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log("mongodb is connected");
    }).catch((err)=>{
        console.log(err);
    });

const app = express();

app.use(express.json());

app.listen(3000,()=>{
    console.log('server is running on port 3000 !');
});
//for run: npm run dev

app.use('/api/user',userRoutes);//akhan theke jabe user.route.js file ae 
app.use('/api/auth',authRoutes);//akhan theke jabe auth.route.js file ae 

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server error';
    res.status(statusCode).json({
        success:false,
        statusCode,
        message
    });
})