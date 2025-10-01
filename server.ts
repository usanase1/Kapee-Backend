import express from "express";
import {Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import mainRouter from "./src/routes/indexRouting";
import bodyParser from "body-parser";
import { connectDB } from "./src/config/databaseConfiguration";
import cors from "cors";    
import path from "path";
dotenv.config();




const app = express();

const port = process.env.PORT || 5000;
//const db_user = process.env.DB_USER;
//const db_pass = process.env.DB_PASS;

//app.get("/" , (req: Request , res: Response) =>{
   // res.send("Initial node js project")
//});



connectDB() 

app.use(express.json());
 app.use(cors());
app.use('/api-v1', mainRouter);
app.use(
  "/images",
  express.static(path.join(__dirname, "../../images"))
);


app.listen(port , () => {
    console.log(`server is running:http://localhost:${port} `)
})
app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello KLab Server</h1>");
});