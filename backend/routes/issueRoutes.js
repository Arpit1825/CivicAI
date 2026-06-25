const express=require('express');
const router=express.Router();

const auth=require('../middleware/authMiddleware');
const isAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {createIssue,
    getAllIssues,
    getMyRaisedIssues,getMySupportedIssues,updateIssueStatus,
    getNearbyIssues,
    toggleSupport}=require('../controllers/issueController');

// router.get("/my-issues",auth,getMyIssues);

router.get("/my-raised", auth, getMyRaisedIssues);

router.get("/my-supported", auth, getMySupportedIssues);

router.post(
    "/:id/support",
    auth,
    toggleSupport
);

router.get(
    "/nearby",
    auth,
    getNearbyIssues
);
router.post(
    "/",
    auth,
    upload.single("image"),
    createIssue
);

// router.post("/",auth,createIssue);
 
router.get("/",auth,getAllIssues);

router.get(
   "/admin-test",
   auth,
   isAdmin,
   (req,res)=>{
      return res.status(200).json({
         success:true,
         message:"Welcome Admin"
      });
   }
);

router.patch(
   "/:id/status",
   auth,
   isAdmin,
   updateIssueStatus
);
module.exports=router;