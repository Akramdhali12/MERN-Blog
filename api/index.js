import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO)
    .then(()=>{
        console.log("mongodb is connected");
    }).catch((err)=>{
        console.log(err);
    });

const app = express();

app.listen(3000,()=>{
    console.log('server is running on port 3000 !');
});
//for run: npm run dev

app.use('/api/user',userRouter);//akhan theke jabe user.route.js file ae 