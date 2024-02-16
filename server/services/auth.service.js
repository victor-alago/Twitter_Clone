import User from "../models/User.js";
// import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import handleError from "../error.js";


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
  
  

 //login
const login = async (req, res, next) =>{
  //get data from form
  const {email, userPassword} = req.body;

  // check if all required fields are submitted
  if (!email || !userPassword){
      // next(handleError(400, "Missing information"));
      return res.status(400).json({error: "Missing information"});
  }

  try{
      //check database for the user with the email
      const user = await User.findOne({email});
      // if user does not exist
      if (!user){
          // next(handleError(401, "User not found!"));
          return res.status(401).json({error: "User not found!"});
      } 
      else{
          // if user exists
          // decrypt database password
          const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
          // convert it back to string
          const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
          // check if passwords match
          if (userPassword !== originalPassword){
              // next(handleError(401, "Wrong credentials"));
              return res.status(401).json({error: "Wrong credentials"});
          }

          // create jwt token
          const token = jwt.sign(
              {id:user._id, username:user.username},
              process.env.SECRET_KEY,
              {expiresIn: "2h"})

          // destructure user object to remove password
          const {password, ...info} = user._doc;
          
          // return response with status, user info, access token and cookie
          return res.cookie("token", token, {httpOnly: true})
          .status(200)
          .json({...info, token});
      };
  }catch(err){
      console.log(err);
      // next(handleError(500, "Failed to login"));
      return res.status(500).json({error: "Failed to login."});
  };
};

export { signup, login };