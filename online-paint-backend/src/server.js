import { Routes } from "./routes";
import { connectToMongoDB } from "./db";

const express = require('express');
const bodyParser = require('body-parser');
const app=express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 8080;

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000'
}));

Routes.forEach(Route=>app[Route.method](Route.path, Route.handler));

connectToMongoDB().then(()=>{
    app.listen(PORT,()=>console.log("Server Up!"))
});


