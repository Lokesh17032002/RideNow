import express from "express";
import { body } from "express-validator";
import { registerUser, login, getUserProfile, logout } from "../controllers/user.controller.js";
import { userAuth } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/register", [
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({ min: 6 }).withMessage('Username must be at least 6 characters long'),
    body('fullName.firstName').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 5 }).withMessage('Password must contain at least 6 characters/numbers'),
], registerUser);

router.post('/login', [
    body('emailOrUsername').notEmpty().withMessage('Email or username is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 6 characters long'),
], login);

router.get('/profile', userAuth, getUserProfile);

router.get('/logout', userAuth, logout);

export default router;
