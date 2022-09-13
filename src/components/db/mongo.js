import dotenv, { config } from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const mongodb_uri = process.env.MONGODB_URI || "mongodb://localhost:27017/canary"

mongoose
    .connect(mongodb_uri,)
    .then(() => {console.log('DB Connection Successfull')})
    .catch((err) => {console.error('DB error ',err);}
);

export default mongoose;
