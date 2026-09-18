import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'Mongo_db_secret_@937';

export default async function authMiddleware(req,res,next){
    //grab token
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({
            success : false,
            message : "Not authorized or token missing."
        });
    }
    const token = authHeader.split(" ")[1];
    
    // to verify token
    try{
        const payload = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(payload.id).select("-password");
        if(!user){
            return res.status(401).json({
                seccess : false,
                message : 'User Not Found.'
            });
        }
        req.user = user;
        next();

    }catch(err){
        console.error("JWT Verification failed : ",err);
        res.status(401).json({
            success : false,
            message : 'Token Invalid or Expired.'
        });
    }
}