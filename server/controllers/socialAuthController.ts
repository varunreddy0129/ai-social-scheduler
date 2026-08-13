
import {Request, Response} from 'express';
import zernio from '../config/zernio.js';
import  User  from '../models/User.js';
import { Account } from "../models/Account.js";
import { AuthRequest} from '../middlewares/authMiddlewares.js';

//HElper to ensure user has a zernio Profile.
const getOrCreateZernioProfile = async (user: any) : Promise<string> => {
    try{
        const result = await zernio.profiles.listProfiles();
        const data = result.data as any;
        const profiles: any[] = Array.isArray(data) ? data : data?.profiles || data?.data || [];

        if(profiles.length > 0){
            const pid = profiles[0]._id || profiles[0].id;
            await User.findByIdAndUpdate(user._id, {zernioProfileId: pid});
            return pid;
        }
        const createResult = await zernio.profiles.createProfile({
            body : {name: `${user.name || user.email}'s workspace`} as any,

        });
        const created = (createResult.data as any);
        const pid = created._id || created.id;
        if(!pid){
            throw new Error('Failed to create Zernio profile');
        }
        await User.findByIdAndUpdate(user._id, {zernioProfileId: pid});
        return pid;
    }catch(error){
        console.error('Error in getOrCreateZernioProfile:', error);
        throw error;
    }
}


//Generate OAuth URL authorization for social media platforms

//GET /api/social-auth/:platform

export const generateAuthUrl = async (req: AuthRequest, res: Response) : Promise<void> => {
    try{
        const {platform} = req.params;
        const profileId = await getOrCreateZernioProfile(req.user);

        const origin  = req.headers.origin;
        const redirectUrl = `${origin}/accounts`;

        const result = await zernio.connect.getConnectUrl({
            path : {platform : platform as any},
            query : {
                profileId,
                redirect_url: redirectUrl
            }
        })

        const data = result.data as any;
        console.log("getConnectUrl response:",JSON.stringify(data,null,2));

        const authUrl = data.authUrl;
        if(!authUrl){
            throw new Error(`zernio returned no authUrl .full response : ${JSON.stringify(data)}`);
        }
        res.json({authUrl});

    }catch(error : any){
        res.status(500).json({error: error.message || 'Internal Server Error'});

    }

}

//Sync connected accounts from zernio into mongoDB
//GET /api/auth/syncAccounts
export const syncAccounts = async (req: AuthRequest, res: Response) :Promise<void> => {
    try{
        const profileId = await getOrCreateZernioProfile(req.user);
        const result = await zernio.accounts.listAccounts({
            query : {profileId} as any

        });
        const data = result.data as any;
        const zernioAccounts: any[] = Array.isArray(data) ? data : data?.accounts || data?.data || [];
        const supportedPlatforms = ['twitter', 'facebook', 'instagram', 'facebook_page', 'linkedin', 'instagram_business'];
        const syncedAccounts = [];

        for(const zAccount of zernioAccounts){
            const zid = zAccount._id || zAccount.id;
            if(!zid){
                console.warn('Skipping account with no ID:', zAccount);
                continue;
            }
            const rawPlatform = (zAccount.platform || zAccount.type || "").toLowerCase();
            const normalizedPlatform = supportedPlatforms.find(p =>  rawPlatform.includes(p));
            if(!normalizedPlatform){
                console.warn(`Skipping unsupported platform: "${rawPlatform}"`, zAccount);
                continue;
            }
            const account  = await Account.findOneAndUpdate(
                {zernioAccountId: zid},
                {
                    user : req.user._id, 
                    platform: normalizedPlatform, 
                     handle: zAccount.handle || zAccount.username || zAccount.name || '', accessToken: zAccount.accessToken || '', refreshToken: zAccount.refreshToken || '', tokenExpiry: zAccount.tokenExpiry ? new Date(zAccount.tokenExpiry) : undefined, status: zAccount.status || 'connected', avatarUrl: zAccount.avatarUrl || ''
                    },
                {upsert: true, returnDocument: 'after'}

            );
            syncedAccounts.push(account);
        }
        res.json(syncedAccounts);
    }catch(error : any){
        res.status(500).json({error: error.message || 'Internal Server Error'});
    }
}