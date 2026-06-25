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
const auth=require('./middleware/authMiddleware');
const authRoutes=require('./routes/authRoutes');
const issueRoutes=require('./routes/issueRoutes');
const { analyzeIssue } = require("./services/geminiService");
const dashboardRoutes=require('./routes/dashboardRoutes')

connectDB();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/dashboard',dashboardRoutes);

app.use("/api/auth",authRoutes);

app.use("/api/issues",issueRoutes);



app.get("/test-gemini", async(req,res)=>{

    try{

        const result = await analyzeIssue(
    "Huge pothole causing accidents on highway"
);

res.json(result);

        // res.send(result);

    }catch(err){

        console.log(err);

        res.status(500).send("Gemini Error");

    }

});
app.get('/',(req,res)=>{
    res.send("CivicAI is running successfully");

})

app.get("/test", auth, (req,res)=>{
    return res.json({
        success:true,
        user:req.user
    });
});

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
    
})