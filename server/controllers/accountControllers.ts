import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddlewares.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";

//Get all accounts



// Get /api/accounts
export const getAccounts = async (req : AuthRequest, res : Response) : Promise<void> => {
    try{
        const accounts = await Account.find({user : req.user._id});
        res.json(accounts);
    }catch(error : any){
        res.status(500).json({message : 'Error fetching accounts', error : error.message});
    }

}

//Add account
export const addAccount = async (req : AuthRequest, res : Response) : Promise<void> => {
    try{
        const {platform, handle ,avatarUrl} = req.body;
        const account = await Account.create({platform, handle, avatarUrl, user : req.user._id});
        // await account.save();
        res.status(201).json(account);
    }catch(error : any){
        res.status(500).json({message : 'Error adding account', error : error.message});
    }
}

//Disconnect account
//DELETE /api/accounts/:id
export const disconnectAccount = async (req : AuthRequest, res : Response) : Promise<void> => {
    try{
        const account = await Account.findOne({_id: req.params.id ,user : req.user._id});
        if(!account){
            res.status(404).json({message : 'Account not found'});
            return;
        }
        if(account.zernioAccountId){
            try{
                await zernio.accounts.deleteAccount({path: {accountId: account.zernioAccountId}})
            }catch(error){
                res.status(500).json({message : 'Error disconnecting account from Zernio', error });
                return;
            }
        }
        await account.deleteOne();
        res.json({message : 'Account disconnected successfully'});
    }catch(error : any){
        res.status(500).json({message : 'Error disconnecting account', error : error.message});
        return;
    }
}