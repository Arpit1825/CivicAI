const Issue = require("../models/Issue");
const { analyzeIssue } = require("../services/geminiService");
const uploadToCloudinary = require("../utils/uploadToCloudinary");


const createIssue = async(req,res)=>{
    try{
        // console.log("BODY:", req.body);
        // console.log("FILE:", req.file);

        let {
            title,
            category,
            latitude,
            longitude
        } = req.body;
        let imageUrl = "";
          
        console.log("File received:", req.file);

if(req.file){

    console.log("Uploading image...");
    const uploadedImage =
        await uploadToCloudinary(req.file.buffer);
   
     console.log(uploadedImage);


    imageUrl = uploadedImage.secure_url;

}
if(
   !title ||
   latitude === undefined ||
   longitude === undefined
){
    return res.status(400).json({
        success:false,
        message:"All fields are required"
    });
}
let severity = "Medium";
let aiSummary = "";

try{

    const aiResult = await analyzeIssue(title, req.file ? req.file.buffer : null);
    console.log(aiResult);

    category = aiResult.category;
    severity = aiResult.severity;
    aiSummary = aiResult.summary;
    
}catch(err){

    console.log("Gemini Error:", err);

}
const existingIssue = await Issue.findOne({
   category,
   latitude,
   longitude,
   status:{
      $ne:"Resolved"
   }
});
if(existingIssue){

    // Spam prevention
    const alreadyReported = existingIssue.reporters.some(
        reporter => reporter.toString() === req.user.id
    );

    if(alreadyReported){
        return res.status(400).json({
            success:false,
            message:"You already reported this issue"
        });
    }
    existingIssue.reportsCount += 1;
    
    existingIssue.reporters.push(req.user.id);

    await existingIssue.save();
console.log("Existing issue found");
console.log(existingIssue.reportsCount);

 return res.status(200).json({
        success:true,
        message:"Existing issue supported",
        issue:existingIssue
    });
}let priorityScore = 1;

if(severity === "Low") priorityScore = 1;
else if(severity === "Medium") priorityScore = 2;
else if(severity === "High") priorityScore = 3;
else if(severity === "Critical") priorityScore = 4;
        
const issue = await Issue.create({
    title,
    category,
    latitude,
    longitude,
    location:{
        type:"Point",
        coordinates:[
            Number(longitude),
            Number(latitude)
        ]
    },
    imageUrl,
    severity,
    aiSummary,
    priorityScore,
    createdBy:req.user.id,
    reporters:[req.user.id]
});
        

        return res.status(201).json({
            success:true,
            message:"Issue Created Successfully",
            issue
        });

    }catch(err){
        console.log(err);
        
        return res.status(500).json({
            success:false,
            err:err.message,
            message:"Internal Server Error"
        });

    }
};
const getAllIssues = async(req,res)=>{
    try{
         const { category, severity, status,page = 1,
    limit = 10 } = req.query;


        const filters = {};
        const skip = (page - 1) * limit;
        if (category) {
            filters.category = category;
        }

        if (severity) {
            filters.severity = severity;
        }

        if (status) {
            filters.status = status;
        }
        const totalIssues = await Issue.countDocuments(filters);

        const issues = await Issue.find(filters)
            .populate("createdBy","name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        return res.status(200).json({
    success:true,
    currentPage:Number(page),
    totalPages:Math.ceil(totalIssues/limit),
    totalIssues,
    count:issues.length,
    issues
});

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }
}

const getMyRaisedIssues = async(req,res)=>{
    try{

        const issues = await Issue.find({
            createdBy:req.user.id
        });

        return res.status(200).json({
            success:true,
            count:issues.length,
            issues
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }
}

const getMySupportedIssues = async(req,res)=>{
    try{

        const issues = await Issue.find({
            reporters:req.user.id
        });

        return res.status(200).json({
            success:true,
            count:issues.length,
            issues
        });

    }catch(err){

        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        });

    }
}

const updateIssueStatus = async(req,res)=>{
   try{

      const { status } = req.body;

      const allowedStatus = [
         "Reported",
         "Verified",
         "In Progress",
         "Resolved"
      ];

      if(!allowedStatus.includes(status)){
         return res.status(400).json({
            success:false,
            message:"Invalid Status"
         });
      }

      const issue = await Issue.findById(req.params.id);

      if(!issue){
         return res.status(404).json({
            success:false,
            message:"Issue not found"
         });
      }

      issue.status = status;

      await issue.save();

      return res.status(200).json({
         success:true,
         message:"Issue status updated successfully",
         issue
      });

   }catch(err){

      return res.status(500).json({
         success:false,
         message:"Internal Server Error"
      });

   }
};
const getNearbyIssues = async (req, res) => {

    try {

        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: "Latitude and Longitude are required"
            });
        }

        const issues = await Issue.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            Number(longitude),
                            Number(latitude)
                        ]
                    },
                    $maxDistance: 5000
                }
            }
        });

        return res.status(200).json({
            success: true,
            count: issues.length,
            issues
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

const toggleSupport = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);
        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        const userId = req.user.id;
        const reporterIndex = issue.reporters.indexOf(userId);

        if (reporterIndex > -1) {
            // User already supported it, so remove support
            issue.reporters.splice(reporterIndex, 1);
            issue.reportsCount = Math.max(1, issue.reportsCount - 1);
            await issue.save();
            return res.status(200).json({
                success: true,
                message: "Support removed",
                issue
            });
        } else {
            // User hasn't supported it yet, add support
            issue.reporters.push(userId);
            issue.reportsCount += 1;
            await issue.save();
            return res.status(200).json({
                success: true,
                message: "Support added",
                issue
            });
        }
    } catch (err) {
        console.log("Error in toggleSupport:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports={createIssue,
    getAllIssues,
    getMyRaisedIssues,
    getMySupportedIssues,
    updateIssueStatus,
    getNearbyIssues,
    toggleSupport};