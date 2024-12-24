import {Webhook} from 'svix';
import userModel from '../models/userModel.js';

// API Controller Functions to manage clerk user with database
// https://localhost:2122/api/user/webhooks

const clerkWebHooks = async(req, res) =>{
    try{
        // Create a SVIX instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id": req.headers['svix-id'],
            "svix-timestamp": req.headers['svix-timestamp'],
            "svix-signature": req.headers['svix-signature']
        });

        const {data, type} = req.body;

        switch(type){
            case 'user.created':
                const userData = {
                    clerkId : data.id,
                    email : data.email_addresses[0].email_address,
                    photo : data.image_url,
                    firstName : data.first_name,
                    lastName : data.last_name,
                }
                await userModel.create(userData);
                res.json({});

                break;
            case 'user.updated':
                const updateData = {
                    email : data.email_addresses[0].email_address,
                    photo : data.image_url,
                    firstName : data.first_name,
                    lastName : data.last_name,
                }

                await userModel.findOneAndUpdate({clerkId: data.id}, updateData);
                res.json({});

                break;
            case 'user.deleted':
                await userModel.findOneAndDelete({clerkId: data.id});
                res.json({});
                break;
            default:
                
                break;
        }

    }catch(err){
        console.log(err.message);
        res.json({
            success: false,
            message: err.message
        })
    }
}

export {clerkWebHooks}