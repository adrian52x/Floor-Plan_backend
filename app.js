import dotenv from "dotenv";
dotenv.config();
import express from "express";

const app = express();


import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import buildingRouter from './Routes/buildingRoutes.js';
import floorRouter from './Routes/floorRoutes.js'
import departmentRouter from './Routes/departmentRoutes.js'
import roomRouter from './Routes/roomRoutes.js'
import userRouter from './Routes/userRoutes.js'
import pcRouter from "./Routes/pcRoutes.js";
import networkPointRouter from "./Routes/networkPointRoutes.js";

import instrumentRouter from './Routes/instrumentRoutes.js'

import roomItemsRouter from "./Routes/roomItemsRoutes.js";
//import emailService from "./Routes/emailService.js"

let mongoURL;
let frontendIP;
let backendIP;


if (process.env.NODE_ENV.trim() === 'production') {
  mongoURL = process.env.MONGO_PROD_URL;
  frontendDNS = process.env.PROD_FRONTEND_DNS;
  frontendIP = process.env.PROD_FRONTEND_IP;
  backendIP = process.env.PROD_BACKEND_IP;
} else {
  mongoURL = process.env.MONGO_DEV_URL;
  frontendIP = process.env.DEV_FRONTEND_IP;
  backendIP = process.env.DEV_BACKEND_IP;

  app.use(morgan("tiny")); // display in console HTTP requests
}


app.use(
  cors({
    credentials: true,
    origin: frontendIP
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(buildingRouter);
app.use(floorRouter);
app.use(departmentRouter);
app.use(roomRouter);
app.use(userRouter);
app.use(pcRouter);

app.use(networkPointRouter);
app.use(instrumentRouter);
app.use(roomItemsRouter);


//app.use(objectRouter);
//app.use(emailService);


app.use(helmet());




// Set strictQuery to false to prepare for the change in Mongoose 7
mongoose.set('strictQuery', false);
console.log('Mongoose version:', mongoose.version);
//console.log(mongoURL);

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
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





app.listen(process.env.PORT, backendIP, () => {
 console.log(`Server running: ${backendIP} : ${process.env.PORT}, Environment: ${process.env.NODE_ENV}`);
});