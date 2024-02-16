import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../error.js";


const signup =  async (req, res) => {
    // get user data from request body
    const {firstname, lastname, username, email, password} = req.body;

    // check if all required fields are submitted
    if (!firstname || !lastname || !username || !email || !password){
        return res.status(400).json({error: "missing information"});
    };

    // check if user already exists
    const user = await User.findOne({email: email});
    if (user){
        return res.status(400).json({error: "User already exists, please login."})
    };

    // hash password
    const passwordHash = CryptoJS.AES.encrypt(
        password, process.env.SECRET_KEY
    ).toString();

    try{
        // create new user
        const newUser = new User({firstname, lastname, username, email, password: passwordHash});
        // save user and return response
        const user = await newUser.save();

        // create jwt token
        const token = jwt.sign(
            {id:user._id, username:user.username},
            process.env.SECRET_KEY,
            {expiresIn: "2h"});

        // destructure user object to remove password
        const {password, ...info} = user._doc;
        // console.log(info);
        
        // return response with status, user info, access token and cookie
        return res
        .cookie("token", token, {httpOnly: true})
        .status(200)
        .json({...info, token});
s
    } catch(err){
        console.log(err)
        return res.status(500).json({error: "Failed to save user."})
    }
};
  
  

  export const signin = async (req, res, next) => {
    try{
        const savedUser = await User.findOne({ username: req.body.username });

        if(!savedUser)
            return next(handleError(404, "User not found"));

        const validPassword = await bcrypt.compareSync(
            req.body.password,
            savedUser.password
        );

        if(!validPassword)
            return next(handleError(400, "Wrong password"));

        const token = jwt.sign(
            { _id: savedUser._id }, process.env.JWT_SECRET);
        
        const { password, ...others } = savedUser._doc;

        res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200)
            .json(others);
    }catch(err){
        next(err);
    }
};