import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { handleError } from "../error.js";


export const signup = async (req, res, next) => {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      const newUser = new User({ ...req.body, password: hash });
  
      await newUser.save();
  
      const token = jwt.sign({ id: newUser._id }, process.env.JWT);
  
      const { password, ...othersData } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(othersData);
    } catch (err) {
      next(err);
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