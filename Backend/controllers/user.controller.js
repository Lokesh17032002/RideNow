import blacklistTokenModel from '../models/blacklistTokenModel.js';
import userModel from '../models/user.model.js';
import { createUser } from "../services/user.service.js";
import { validationResult } from 'express-validator';

export const registerUser = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, username, email, password } = req.body;

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or username" });
        }

        // Hash the password
        const hashedPassword = await userModel.hashPassword(password);

        // Create the user
        const user = await createUser({
            firstName: fullName.firstName,
            lastName: fullName.lastName,
            username, 
            email,
            password: hashedPassword,
        });

        // Generate a token
        const token = user.generateAuthToken();

        // Respond with the user and token
        res.status(201).json({ token, user });

    } catch (error) {
        console.error('Error in user registration:', error);
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { emailOrUsername, password } = req.body;

        // let query = {};
        // if (email) {
        //     query.email = email;  // Search by email
        // } else if (username) {
        //     query.username = username;  // Search by username
        // }

        // const user = await userModel.findOne(query).select('+password');
        const user = await userModel.findOne({ $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).select('+password');

        if (!user) {
            return res.status(404).json({ message: "Invalid email or username" });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Wrong password" });
        }

        const token = user.generateAuthToken();

        res.cookie('token', token);

        return res.status(200).json({ token, user });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const getUserProfile = async(req, res, next) => {
    res.status(200).json(req.user);
}

export const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        // if (!token) {
        //     return res.status(400).json({ message: "Token is required to logout" });
        // }

        await blacklistTokenModel.create({ token });

        res.status(200).json({ message: 'Logged Out Successfully' });

    } 
    catch (error) {
        console.error("Error in logout:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

