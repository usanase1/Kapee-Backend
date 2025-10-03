"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const indexRouting_1 = __importDefault(require("./src/routes/indexRouting"));
const databaseConfiguration_1 = require("./src/config/databaseConfiguration");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const swagger_1 = require("./src/config/swagger");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
//const db_user = process.env.DB_USER;
//const db_pass = process.env.DB_PASS;
//app.get("/" , (req: Request , res: Response) =>{
// res.send("Initial node js project")
//});
(0, databaseConfiguration_1.connectDB)();
app.use(express_1.default.json());
const allowedOrigins = [
    process.env.FRONTEND_URL_DEV,
    process.env.FRONTEND_URL_PROD
].filter((origin) => typeof origin === "string");
app.use((0, cors_1.default)({
    origin: allowedOrigins
}));
app.use('/api-v1', indexRouting_1.default);
app.use("/images", express_1.default.static(path_1.default.join(__dirname, "../../images")));
app.listen(port, () => {
    console.log(`server is running:http://localhost:${port} `);
});
app.get("/", (req, res) => {
    res.send("<h1>Hello KLab Server</h1>");
});
app.get("/", (req, res) => {
    res.redirect("/docs");
});
app.use("/docs", swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.swaggerDocs));
