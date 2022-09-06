import dotenv, { config } from 'dotenv';
import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


import { registerValidations } from './validations/auth.js';
import { validationResult } from 'express-validator';

import UserModel from './models/user.js';
import checkAuth from './utils/checkAuth.js';
//////////////////////////////////////////////////////////
const app = express ();
app.use(express.json());
///////VARIABLES
dotenv.config();
const host=process.env.HOST || "127.0.0.1";
const port = process.env.PORT || "3000"
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/canary"
///////MONGO
mongoose
    .connect(mongodb_uri,)
    .then(() => {console.log('DB Connection Successfull')})
    .catch((err) => {console.error('DB error ',err);}
);
//////////////////////////////////////////////////////////

app.post('/auth/login', async (req,res) => {
    try {
        const user = await UserModel.findOne({email:req.body.email});
        if (!user) {
            return res.status(400).json({
                message: "Wrong username or password",
            });
        };
        const ifValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!ifValidPass){
            return res.status(400).json({
                message: "Wrong username or password",
            });
        };

        const token = jwt.sign({
            _id: user._id,
            },
            process.env.APP_KEY,
            {
                expiresIn: "30d",
            }
        );

        const {passwordHash, ... userData} = user._doc;

        res.status(200).json({
            ... userData,
            token,
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Authentication failed",
        });
    };
});
app.post('/auth/register', registerValidations, async (req,res) =>{
    try {
        const errors= validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json(errors.array());
        };

        const password = req.body.password;
        const sault = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,sault);
        
        const doc = new UserModel({
            email: req.body.email,
            userName: req.body.userName,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
            },
            process.env.APP_KEY,
            {
                expiresIn: "30d",
            }
        );
        
        const {passwordHash, ... userData} = user._doc;

        res.status(200).json({
            ... userData,
            token,
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: "Register failed",
        });
    };
});
app.get('/auth/user', checkAuth, async(req,res) =>{
    try {
        
    } catch (err) {};
});

app.listen(port,host,(err) =>{
    if (err){
        return console.log(err);
    }
    console.log ('Server Start Successfull');
});

