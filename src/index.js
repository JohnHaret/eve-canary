import dotenv, { config } from 'dotenv';
import express, { json } from 'express';

import * as validator from './helpers/validations.js';
import checkAuth from "./helpers/checkAuth.js";
import * as userController from './components/userController.js'; 
//////////////////////////////////////////////////////////
const app = express ();
app.use(express.json());
///////VARIABLES
dotenv.config();
const host=process.env.HOST || "127.0.0.1";
const port = process.env.PORT || "3000"
//////////////////////////////////////////////////////////

app.post('/auth/login', validator.login, userController.login);
app.post('/auth/register', validator.register, userController.register);
app.get('/auth/user', checkAuth, userController.userInfo);

app.listen(port,host,(err) =>{
    if (err){
        return console.log(err);
    }
    console.log ('Server Start Successfull');
});
