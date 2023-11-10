import Router from "express";
const router = Router();

import User from "../Model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { verifyToken, adminOnly } from "../middleware.js";


// Get all users
router.get("/api/users", adminOnly, async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users) 
    } catch (error) {
        res.status(400).json({ message: "something wrong, please try again." })
    }
});


// Register
router.post("/api/register", async (req, res) => {
    // Our register logic starts here
   try {
        // Get user input
        const { userName, password, isAdmin } = req.body;

        // Validate user input
        if (!(userName && password )) {
            return res.status(400).send("All input are required");
        }

        // Validate userName
        if ( userName.length < 4) {
            return res.status(400).send("Username must have at least 4 characters");
        }

        // checks if user already exist
        // Validates if user exist in our database
        const oldUser = await User.findOne({ userName });

        if (oldUser) {
            return res.status(409).send("Username already in use");
        } 
 
        //Encrypt user password
        const encryptedUserPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            userName: userName.toLowerCase(), // sanitize,
            password: encryptedUserPassword,
            isAdmin: isAdmin
        });

        // return new user
        return res.status(201).json(user);

    } catch (error) {
        if (error.code === 11000 && error.keyValue.userName) {
            // Custom response for duplicate username
            res.status(400).json({ error: 'Username already exists' });
        } else {    
            return res.status(500).json({ message: 'Failed to register user', error });
        }
    }    
});

// Login
router.post("/api/login", async (req, res) => {
    try {
        // Get user input
        const { userName, password } = req.body;
    
        // Validate user input
        if (!(userName && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ userName });
        
    
        if (user && bcrypt.compare(password, user.password)) {
            // Create token
            const token = jwt.sign({ userId: user._id, userName, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: "5h"});

            // create cookie
            res.cookie('jwt_auth', token, {
                //domain: '.biologics-floorplan.agc.jp',
                maxAge: 5 * 60 * 60 * 1000, // 5 hours
                sameSite: "strict",
            })
    
            
            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (error) {
        return res.status(400).json({ message: "something wrong"})
    }    
});


// Logout
router.post("/api/logout", async (req, res) => {
    try {
        res.cookie('jwt_auth', '', {maxAge: 0}) 
        return res.status(200).json({ message: "Logged out"});
    } catch (error) {
        return res.status(500).json({ message: error});
    } 
});

// Current user by token
router.get("/api/user", async (req, res) => {
    try {
        const cookie = req.cookies['jwt_auth']
        

        const credentials = jwt.verify(cookie, process.env.SECRET_KEY)

        const user = await User.findOne({ _id: credentials.userId })

        // pass data without password
        const {password, ...data} = user.toJSON()

        

        return res.status(200).json(data);

    } catch (error) {
        return res.status(401).json({ message: 'Unauthenticated', error })
    }
});


export default router;