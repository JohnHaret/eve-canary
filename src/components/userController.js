import dotenv, { config } from 'dotenv';
import express, { json } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from './db/mongo.js';
import { validationResult } from 'express-validator';
import UserModel from '../models/user_models.js';


export const register = async (req,res) =>{
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
};

export const login =  async (req,res) => {
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
};

export const userInfo = async(req,res) =>{
    try {
        const user = await UserModel.findById(req.userId);

        if(!user){
            return res.status(404).json({
                message: "Something goes wrong",
            });
        };
        const {passwordHash, ... userData} = user._doc;

        res.status(200).json({
            ... userData,
        });
    } catch (err){
        console.log(err);
        res.status(500).json({
            message: "Request failed",
        });
    };
};