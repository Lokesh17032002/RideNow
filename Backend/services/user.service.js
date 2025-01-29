import userModel from "../models/user.model.js";

export const createUser = async({firstName, lastName, username, email, password}) => {
    try {
        if (!firstName || !username || !email || !password) {
            throw new Error('All fields are required!');
        }

        const user = await userModel.create({
            fullName: { firstName, lastName },
            username,
            email,
            password,
        });

        return user;

    } catch (error) {
        console.error("Error creating user:", error.message);
        throw new Error("Failed to create user. Please try again later.");
    }
};
