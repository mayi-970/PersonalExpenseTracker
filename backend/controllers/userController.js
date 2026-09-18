import User from "../models/userModel.js"; // for default exports we can use any name explicitly.
import validator from 'validator';         // for named exports we have to use 'as' keyword like in python.
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'Mongo_db_secret_@937';
const TOKEN_EXPIRES = '24h';

const createToken = (userId) => jwt.sign({id : userId}, JWT_SECRET, {expiresIn : TOKEN_EXPIRES}); 

export async function registerUser(req,res){
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({
            success : false,
            message : "All fields are required."
        });
    }

    if(!validator.isEmail(email)){
        return res.status(400).json({
            success : false,
            message : "Invalid Email"
        });
    }

    if(password.length < 8){
        return res.status(400).json({
            success : false,
            message : "Password must be atleast 8 Characters"
        });
    }

    try{
        if(await User.findOne({email})){
            return res.status(400).json({
                success : false,
                message : "User Already exists"
            });
        }

        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password : hashed});
        const token = createToken(user._id);
        res.status(201).json({
            success : true,
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email 
            }
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
}

//Login User
export async function loginUser(req,res) {
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            seccess : false,
            message : 'Both fields are required.'
        });
    }

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                seccess : false,
                message : 'Invalid email or password'
            });
        }

        const matched = await bcrypt.compare(password,user.password);
        if(!matched){
            return res.status(401).json({
                seccess : false,
                message : 'Invalid email or password'
            });
        }

        const token = createToken(user._id);
        res.json({
            success : true,
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email 
            }
        });   

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
}

// to get user credentials
export async function getCurrentUser(req,res) {

    try{

        const user = await User.findById(req.user.id).select("name email");
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User Not Found"
            });
        }
        res.json({
            success : true,
            user 
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
}

// update user profile
export async function updateProfile(req,res) {

    const {email,name} = req.body;
    if(!name || !email || !validator.isEmail(email)){
        return res.status(400).json({
            success : false,
            message : "Valid Email & name are required"
        });

    }

    try{

        const exists = await User.findOne({email,_id:{$ne: req.user.id}});
        if(exists){
            return res.status(409).json({
                success : false,
                message : "email already in use."
            });
        }
        const user = await User.findByIdAndUpdate(
            req.user.id,
            {name,email},
            {new : true, runValidators : true, select : "name email"}
        );
        res.json({
            success : true,
            user
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
} 


// to change user password
export async function updatePassword(req,res){

    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword || newPassword.length < 8){
        return res.status(400).json({
            success : false,
            message : "Invalid password or too Short."
        });
    }

    try{
        const user = await User.findById(req.user.id).select("password");
        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not Found."
            });
        }

        const match = await bcrypt.compare(currentPassword,user.password);
        if(!match){
            return res.status(401).json({
                success : false,
                message : "Current Password is incorrect."
            });
        }
        user.password = await bcrypt.hash(newPassword,10);
        await user.save();
        res.json({
            success : true,
            message : "Password updated successfully."
        });

    }catch(err){
        console.error(err);
        res.status(500).json({
            success : false,
            message : 'Server Error'
        });
    }
}