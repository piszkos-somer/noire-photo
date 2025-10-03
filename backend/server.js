const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mysql = require('mysql');

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.get("/", (req,res)=>{
    res.send("Fut a backend!");
});

app.listen(3001, ()=> {
    console.log("Fut a szerver!")
});