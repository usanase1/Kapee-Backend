import express from "express";
import {Request, Response} from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import mainRouter from "./src/routes/indexRouting";
import bodyParser from "body-parser";
import { connectDB } from "./src/config/databaseConfiguration";
import cors from "cors";    
import path from "path";
import { swaggerUi, swaggerDocs } from "./src/config/swagger";
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


const allowedOrigins = [
  process.env.FRONTEND_URL_DEV,
  process.env.FRONTEND_URL_PROD
].filter((origin): origin is string => typeof origin === "string");

app.use(cors({
  origin: allowedOrigins
}));

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

app.get("/", (req: Request, res: Response) => {
  res.redirect("/docs");
  })

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))