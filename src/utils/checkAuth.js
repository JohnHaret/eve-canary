import jwt from "jsonwebtoken";
import dotenv, { config } from 'dotenv';

export default (req,res,next) => {
    const token = (req.headers.authorization || '').replace(/Bearer\s?/,'');
    if(token){
        try {
            const decode = jwt.verify(token,process.env.APP_KEY);
            req.userId = decode._id;
        } catch (err) {};
    } else {
        return res.status(400).json({
            message: "Request failed"
        });
    };
    console.log(token);
};