import { Router } from "express";

import {
    generateAuthUrl,
    syncAccounts
} from "../controllers/socialAuthController.js";

import { protect } from "../middlewares/authMiddlewares.js";

const socialAuthRouter = Router();

// Generate OAuth URL
socialAuthRouter.get(
    "/:platform/url",
    protect,
    generateAuthUrl
);

// Sync connected accounts
socialAuthRouter.get(
    "/sync",
    protect,
    syncAccounts
);

export default socialAuthRouter;