import express from "express";
import {protect} from "../middlewares/authMiddlewares.js";
import {generatePost, getGenerations,getPosts,schedulePost} from "../controllers/postController.js";
import {upload} from "../config/multter.js"

const postRouter = express.Router();
postRouter.get('/',protect,getPosts);
postRouter.get('/generations',protect,getGenerations);
postRouter.post('/',protect,upload.single("meida"),schedulePost);
postRouter.post('/generate',protect,generatePost);


export default postRouter;

