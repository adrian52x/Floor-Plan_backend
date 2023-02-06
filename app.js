import dotenv from "dotenv";
dotenv.config();
import express from "express";


const app = express();


app.use(express.urlencoded({ extended: true }));



import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080"
  })
);

import cookieParser from "cookie-parser";
app.use(cookieParser());


import buildingRouter from './Routes/buildingRoutes.js';
import objectRouter from './Routes//objectRoutes.js';


app.use(express.json());
app.use(buildingRouter);
app.use(objectRouter);



app.use(helmet());
app.use(morgan("tiny")); // display in console HTTP requests


mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, err => {
  if(err){
    console.log("connection error: ", err);
  }
  else{
    console.log("Connected to MongoDB successfully");
  }
}); 



app.listen(process.env.PORT, () => {
 console.log(`Server is listening on port ${process.env.PORT}`);
});