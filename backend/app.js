require('dotenv').config();
const express=require('express');
const app=express();
const path=require('path');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const PORT=process.env.PORT || 5000;
const connectDB=require('./config/db');

connectDB();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


app.get('/',(req,res)=>{
    res.send("CivicAI is running successfully");

})

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})