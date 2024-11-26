import express, { Express } from "express";
import path from "path";
import router from "./src/routes"
import morgan from "morgan";
import cors from "cors";
import mongoose, {Connection} from "mongoose";

const app : Express = express();
const port = 3000;

const mongoDB: string = "mongodb://localhost:27017/userdb";
const mongoDBCG: string = "mongodb://127.0.0.1:27017/testdb";
mongoose.connect(mongoDBCG)
mongoose.Promise = Promise;
const db: Connection = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));


app.use(cors())
app.use(express.json())
app.use(morgan("dev"))



app.use(express.static(path.join(__dirname, "../public")))

app.use("/",router);

app.listen(port, ()=>{

  console.log(`server running on port ${port}`)

})