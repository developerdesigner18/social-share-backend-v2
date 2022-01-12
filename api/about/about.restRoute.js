import express from 'express'
import {
    addWork,
    updateWork,
    deleteWork,
    addHighSchool,
    updateHighSchool,
    deleteHighSchool,
    addFamilyMember,
    updateFamilyMember,
    deleteFamilyMember,
    addSingleArray,
    updateSingleArray,
    deleteSingleArray,
    deleteAbout,
    updateAbout,
    getAboutData

} from './about.controller'
export const aboutRouter = express.Router();

aboutRouter.post("/addWork",addWork);
aboutRouter.post("/updateWork",updateWork);
aboutRouter.post("/deleteWork",deleteWork);

aboutRouter.post("/addHighSchool",addHighSchool);
aboutRouter.post("/updateHighSchool",updateHighSchool);
aboutRouter.post("/deleteHighSchool",deleteHighSchool);

aboutRouter.post("/addFamilyMember",addFamilyMember);
aboutRouter.post("/updateFamilyMember",updateFamilyMember);
aboutRouter.post("/deleteFamilyMember",deleteFamilyMember);

aboutRouter.post("/addSingleArray",addSingleArray);
aboutRouter.post("/updateSingleArray",updateSingleArray);
aboutRouter.post("/deleteSingleArray",deleteSingleArray)

aboutRouter.post("/updateAbout",updateAbout)
aboutRouter.post("/deleteAbout",deleteAbout)

aboutRouter.get("/getAboutData",getAboutData) // get about data with header 

