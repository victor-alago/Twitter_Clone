import User from "../models/User.js";
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