import userModel from '../models/user.model.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import blacklistTokenModel from "../models/blacklistTokenModel.js"


export const userAuth = async(req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
    
        if(!token){
            return res.status(401).json({ message: 'Unauthorized' });
        }
    
        const isBlacklisted = await blacklistTokenModel.findOne({ token: token });
        if(isBlacklisted){
            res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;

        next();
    } 
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized user' });
    }
}