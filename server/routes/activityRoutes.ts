import express from "express";

import {protect} from "../middlewares/authMiddlewares.js";
import {getActivity} from "../controllers/activityController.js"


const activityRouter = express.Router();

activityRouter.get('/',protect,getActivity)

export default activityRouter;
