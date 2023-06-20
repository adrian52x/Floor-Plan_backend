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
    origin: process.env.FRONTEND_IP
  })
);

import cookieParser from "cookie-parser";
app.use(cookieParser());


import buildingRouter from './Routes/buildingRoutes.js';
import floorRouter from './Routes/floorRoutes.js'
import departmentRouter from './Routes/departmentRoutes.js'
import roomRouter from './Routes/roomRoutes.js'
import instrumentRouter from './Routes/instrumentRoutes.js'
import roomInstrumentRouter from './Routes/roomInstrumentRoutes.js'


import objectRouter from './Routes/objectRoutes.js';
import emailService from './Routes/emailService.js'



app.use(express.json());
app.use(buildingRouter);
app.use(floorRouter);
app.use(departmentRouter);
app.use(roomRouter);
app.use(instrumentRouter);
app.use(roomInstrumentRouter);

app.use(objectRouter);
app.use(emailService);



app.use(helmet());
app.use(morgan("tiny")); // display in console HTTP requests


// Set strictQuery to false to prepare for the change in Mongoose 7
mongoose.set('strictQuery', false);
console.log('Mongoose version:', mongoose.version);

const connectWithRetry = () => {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err) => {
    if (err) {
      console.error('Connection error:', err);
      console.log('Retrying connection in 5 seconds...');
      setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    } else {
      console.log('Connected to MongoDB successfully');
    }
  });
};

// Initial connection attempt
connectWithRetry();





app.listen(process.env.PORT, () => {
 console.log(`Server is listening on port ${process.env.PORT}`);
});