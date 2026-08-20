import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewares.js";
import { GoogleGenAI } from "@google/genai";
import Replicate from "replicate";
import { cloudinary } from "../config/cloudinary.js";
import { Generation } from "../models/Generation.js";
import { Post } from "../models/Post.js";

// =========================================================
// Generate post
// POST /api/posts/generate
// =========================================================

export const generatePost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {

    try {

        const { prompt, tone, generateImage } = req.body;

        // =========================================================
        // 1. GEMINI - GENERATE SOCIAL MEDIA CONTENT
        // =========================================================

        const geminiApiKey = process.env.GEMINI_API_KEY;

        if (!geminiApiKey) {

            res.status(400).json({
                message:
                    "Gemini API key is missing. Please add it to your server/.env file.",
            });

            return;
        }

        const ai = new GoogleGenAI({
            apiKey: geminiApiKey,
        });

        const textResponse = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: `Generate a social media post based on this prompt: "${prompt}".

Tone: ${tone}.

Include relevant hashtags.

Format the response as JSON with "content" and "imagePrompt" fields.

The "imagePrompt" should be a highly descriptive prompt for an image generator that complements the post.`,

        });

        // =========================================================
        // 2. EXTRACT GEMINI RESPONSE
        // =========================================================

        let content = "";
        let imagePrompt = prompt;

        try {

            const rawText = textResponse.text || "";

            const jsonMatch = rawText.match(/\{[\s\S]*\}/);

            const data = jsonMatch
                ? JSON.parse(jsonMatch[0])
                : {
                    content: rawText,
                    imagePrompt: prompt,
                };

            content = data.content;
            imagePrompt = data.imagePrompt;

        } catch (error) {

            console.error(
                "Error parsing Gemini response:",
                error
            );

            content = textResponse.text || "";
            imagePrompt = prompt;
        }

        // =========================================================
        // 3. REPLICATE - GENERATE IMAGE
        // =========================================================

        let mediaUrl = "";
        let mediaType: "image" | "video" | undefined;

        if (generateImage) {

            try {

                const replicateApiKey =
                    process.env.REPLICATE_API_KEY;

                if (!replicateApiKey) {

                    throw new Error(
                        "Replicate API key is missing. Please add REPLICATE_API_KEY to your .env file."
                    );

                }

                const replicate = new Replicate({
                    auth: replicateApiKey,
                });

                console.log(
                    "Generating image with Replicate..."
                );

                const output = await replicate.run(

                    "black-forest-labs/flux-schnell",

                    {
                        input: {
                            prompt: imagePrompt,
                        },
                    }

                );

                console.log(
                    "Replicate output:",
                    output
                );

                // =================================================
                // 4. UPLOAD REPLICATE IMAGE TO CLOUDINARY
                // =================================================

                if (
                    Array.isArray(output) &&
                    output.length > 0
                ) {

                    const replicateImageUrl =
                        output[0].toString();

                    console.log(
                        "Replicate image URL:",
                        replicateImageUrl
                    );

                    console.log(
                        "Uploading generated image to Cloudinary..."
                    );

                    const cloudinaryResult =
                        await cloudinary.uploader.upload(

                            replicateImageUrl,

                            {
                                folder: "social-scheduler",
                                resource_type: "image",
                            }

                        );

                    mediaUrl =
                        cloudinaryResult.secure_url;

                    mediaType = "image";

                    console.log(
                        "Cloudinary image URL:",
                        mediaUrl
                    );
                }

            } catch (error: any) {

                console.error(
                    "Image generation/upload error:",
                    error?.message || error
                );

                mediaUrl = "";
                mediaType = undefined;
            }
        }

        // =========================================================
        // 5. SAVE GENERATION TO DATABASE
        // =========================================================

        const generation = await Generation.create({

            user: req.user._id,

            prompt,

            content,

            mediaUrl,

            mediaType,

            tone,

        });

        // =========================================================
        // 6. RETURN GENERATION
        // =========================================================

        res.status(201).json(generation);

    } catch (error: any) {

        console.error(
            "Generate post error:",
            error?.message || error
        );

        res.status(500).json({

            success: false,

            message: "Failed to generate post",

            error:
                error?.message ||
                "Unknown error",

        });
    }
};


// =========================================================
// Get generations
// GET /api/posts/generations
// =========================================================

export const getGenerations = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {

    try {

        const generations = await Generation.find({

            user: req.user._id,

        }).sort({

            createdAt: -1,

        });

        res.status(200).json(generations);

    } catch (error: any) {

        console.error(
            "Get generations error:",
            error?.message || error
        );

        res.status(500).json({

            success: false,

            message: "Failed to get generations",

            error:
                error?.message ||
                "Unknown error",

        });
    }
};


// =========================================================
// Get posts
// GET /api/posts
// =========================================================

export const getPosts = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {

    try {

        const posts = await Post.find({

            user: req.user._id,

        }).sort({

            createdAt: -1,

        });
        res.status(200).json(posts);

    } catch (error: any) {
        console.error(
            "Get posts error:",
            error?.message || error
        );
        res.status(500).json({
            success: false,
            message: "Failed to get posts",
            error:
                error?.message ||
                "Unknown error",
        });
    }
};
// =========================================================
// Schedule post
// POST /api/posts
// =========================================================

export const schedulePost = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const {
            content,
            platforms,
            scheduledFor,
            status,
        } = req.body;
        // 1. PARSE PLATFORMS
        let parsedPlatforms;
        try {
            parsedPlatforms =
                typeof platforms === "string"
                    ? JSON.parse(platforms)
                    : platforms;
        } catch (error) {
            res.status(400).json({
                success: false,
                message: "Invalid platforms format",
            });
            return;
        }
        // 2. HANDLE FILE UPLOAD
        let mediaUrl = "";
        let mediaType: "image" | "video" | undefined;
        if (req.file) {
            const result = await new Promise<any>(
                (resolve, reject) => {
                    const stream =
                        cloudinary.uploader.upload_stream(
                            {
                                resource_type: "auto",
                                folder: "social-scheduler",
                            },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                    stream.end(req.file!.buffer);
                }
            );
            // 3. GET CLOUDINARY URL
            mediaUrl = result.secure_url;
            mediaType =
                result.resource_type === "video"
                    ? "video"
                    : "image";
        }
       // 4. CREATE POST IN DATABASE
        const post = await Post.create({
            user: req.user._id,
            content,
            platforms: parsedPlatforms,
            mediaUrl,
            mediaType,
            scheduledFor,
            status,
        });
        // 5. RETURN POST
        res.status(201).json(post);
    } catch (error: any) {
        console.error(
            "Schedule post error:",
            error?.message || error
        );
        res.status(500).json({
            success: false,
            message: "Failed to schedule post",
            error:
                error?.message ||
                "Unknown error",
        });
    }
};