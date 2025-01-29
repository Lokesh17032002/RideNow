import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import connectToDb from "./db/db.js"
// import router from "./routes/user.routes.js"
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res)=>{ 
    res.send("Hello World") ; 
});

app.use('/users', userRoutes);

export default app;