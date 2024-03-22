import jwt from "jsonwebtoken";
import handleError from "./error.js";

const verify = (req, res, next) => {
    // get token from cookie
    const token = req.cookies.token;

    // check if token exists
    if (!token){
        return next(handleError(401, "You are not authenticated!"));
    }

    // verify the token
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err){
            return next(handleError(403, "Token is invalid for this operation!"));
        } else {
            req.user = user;
            next();
        };
    });
};

export default verify;