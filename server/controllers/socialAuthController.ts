import { Response } from "express";
import zernio from "../config/zernio.js";
import User from "../models/User.js";
import { Account } from "../models/Account.js";
import { AuthRequest } from "../middlewares/authMiddlewares.js";

// ======================================================
// GET OR CREATE ZERNIO PROFILE
// ======================================================

const getOrCreateZernioProfile = async (
    user: any
): Promise<string> => {
    try {
        // If profile already exists, use it
        if (user.zernioProfileId) {
            return user.zernioProfileId;
        }

        // Check existing Zernio profiles
        const result = await zernio.profiles.listProfiles();

        const data = result.data as any;

        const profiles: any[] = Array.isArray(data)
            ? data
            : data?.profiles || data?.data || [];

        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;

            if (!pid) {
                throw new Error(
                    "Zernio profile found but profile ID is missing"
                );
            }

            await User.findByIdAndUpdate(
                user._id,
                {
                    zernioProfileId: pid
                }
            );

            return pid;
        }

        // Create new Zernio profile
        const createResult =
            await zernio.profiles.createProfile({
                body: {
                    name: `${user.name || user.email}'s workspace`
                } as any
            });

        const created = createResult.data as any;

        const pid = created?._id || created?.id;

        if (!pid) {
            throw new Error(
                "Failed to create Zernio profile"
            );
        }

        await User.findByIdAndUpdate(
            user._id,
            {
                zernioProfileId: pid
            }
        );

        return pid;

    } catch (error) {
        console.error(
            "Error in getOrCreateZernioProfile:",
            error
        );

        throw error;
    }
};


// ======================================================
// GENERATE OAUTH URL
// GET /api/oauth/:platform/url
// ======================================================

export const generateAuthUrl = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        console.log("======================================");
        console.log("OAuth request received");

        const { platform } = req.params;

        console.log("Platform:", platform);
        console.log("User:", req.user?._id);

        // Check authenticated user
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized. Please login again."
            });

            return;
        }

        // Check platform
        if (!platform) {
            res.status(400).json({
                message: "Platform is required"
            });

            return;
        }

        console.log(
            "Connecting platform:",
            platform
        );

        // Get/create Zernio profile
        const profileId =
            await getOrCreateZernioProfile(req.user);

        console.log(
            "Zernio profile ID:",
            profileId
        );

        // Frontend URL
        const frontendUrl =
            process.env.CLIENT_URL ||
            "http://localhost:5173";

        const redirectUrl =
            `${frontendUrl}/accounts`;

        console.log(
            "OAuth redirect URL:",
            redirectUrl
        );

        // Request OAuth URL from Zernio
        const result =
            await zernio.connect.getConnectUrl({
                path: {
                    platform: platform as any
                },

                query: {
                    profileId,
                    redirect_url: redirectUrl
                }
            });

        console.log(
            "Zernio raw response:",
            JSON.stringify(
                result.data,
                null,
                2
            )
        );

        const data = result.data as any;

        // Support either response format
        const authUrl =
            data?.authUrl ||
            data?.url;

        if (!authUrl) {
            console.error(
                "Zernio did not return OAuth URL:",
                data
            );

            res.status(500).json({
                message:
                    "Zernio did not return an OAuth URL",
                details: data
            });

            return;
        }

        console.log(
            "OAuth URL generated successfully"
        );

        // IMPORTANT:
        // Frontend expects data.url
        res.status(200).json({
            url: authUrl
        });

    } catch (error: any) {
        console.error(
            "======================================"
        );

        console.error(
            "OAuth URL generation failed"
        );

        console.error(
            "Platform:",
            req.params.platform
        );

        console.error(
            "Error:",
            error
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Response:",
            error?.response?.data
        );

        console.error(
            "======================================"
        );

        res.status(500).json({
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Failed to generate OAuth URL"
        });
    }
};


// ======================================================
// SYNC CONNECTED ACCOUNTS
// GET /api/oauth/sync
// ======================================================

export const syncAccounts = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        // Check authenticated user
        if (!req.user) {
            res.status(401).json({
                message:
                    "Unauthorized. Please login again."
            });

            return;
        }

        // Get Zernio profile
        const profileId =
            await getOrCreateZernioProfile(req.user);

        // Get Zernio accounts
        const result =
            await zernio.accounts.listAccounts({
                query: {
                    profileId
                } as any
            });

        const data = result.data as any;

        const zernioAccounts: any[] =
            Array.isArray(data)
                ? data
                : data?.accounts ||
                  data?.data ||
                  [];

        console.log(
            "Zernio accounts:",
            JSON.stringify(
                zernioAccounts,
                null,
                2
            )
        );

        const supportedPlatforms = [
            "twitter",
            "facebook",
            "instagram",
            "facebook_page",
            "linkedin",
            "instagram_business"
        ];

        const syncedAccounts = [];

        for (const zAccount of zernioAccounts) {

            const zid =
                zAccount?._id ||
                zAccount?.id;

            if (!zid) {
                console.warn(
                    "Skipping account with no ID:",
                    zAccount
                );

                continue;
            }

            const rawPlatform = (
                zAccount?.platform ||
                zAccount?.type ||
                ""
            ).toLowerCase();

            const normalizedPlatform =
                supportedPlatforms.find(
                    (platform) =>
                        rawPlatform.includes(platform)
                );

            if (!normalizedPlatform) {
                console.warn(
                    `Skipping unsupported platform: "${rawPlatform}"`
                );

                continue;
            }

            const account =
                await Account.findOneAndUpdate(
                    {
                        zernioAccountId: zid
                    },

                    {
                        user: req.user._id,

                        platform:
                            normalizedPlatform,

                        handle:
                            zAccount?.handle ||
                            zAccount?.username ||
                            zAccount?.name ||
                            "",

                        accessToken:
                            zAccount?.accessToken ||
                            "",

                        refreshToken:
                            zAccount?.refreshToken ||
                            "",

                        tokenExpiry:
                            zAccount?.tokenExpiry
                                ? new Date(
                                      zAccount.tokenExpiry
                                  )
                                : undefined,

                        status:
                            zAccount?.status ||
                            "connected",

                        avatarUrl:
                            zAccount?.avatarUrl ||
                            ""
                    },

                    {
                        upsert: true,
                        new: true
                    }
                );

            syncedAccounts.push(account);
        }

        res.status(200).json(
            syncedAccounts
        );

    } catch (error: any) {
        console.error(
            "Account sync failed:",
            error
        );

        console.error(
            "Message:",
            error?.message
        );

        console.error(
            "Response:",
            error?.response?.data
        );
        res.status(500).json({
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Failed to sync accounts"
        });
    }
};