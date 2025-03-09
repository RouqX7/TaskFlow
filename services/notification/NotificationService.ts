import {Notification} from '../../models/Notification'
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const notificationSchema = Joi.object({
    id:Joi.string().required(),
    userId:Joi.string().required(),
    message:Joi.string().required(),
    type:Joi.string().required(),
    read:Joi.boolean().required(),
    createdAt:Joi.date().default(() => new Date()),
    updateAt:Joi.date().default(() => new Date()),
})

export const createNotification = async (
    notification: Partial<Notification>,
    userId:string
): Promise<DBResponse<string>> => {
    try {
        if(!userId){
            return {
                success:false,
                message: "User ID is required",
                status: 400,
            };
        }

        const notificationWithDefaults = {
            id: uuidv4(),
            message:notification.message ?? "",
            type:notification.type ?? "",
            read:notification.read ?? false,
            createdAt: new Date(),
            updatedAt: new Date()
        } as Notification;

        const validatedNotification = await notificationSchema.validateAsync(notificationWithDefaults, {
            abortEarly:false,
        });

        await firestoreAdmin
        .collection(DBPath.notifications)
        .doc(validatedNotification.id)
        .set(validatedNotification);

        return {
            success:true,
            message:"Notification created successfully",
            status:200,
            data:validatedNotification.id,
        }
        
    } catch (error) {
        return {
            success:false,
            message: " Validation failed " + (error as any).message,
            status:400,
        };
    }
}

export const getNotification = async(id?:string): Promise<DBResponse<Notification>> => {
    if(!id) { 
        return {
            success:false,
            message:"Notification ID is required",
            status:400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.notifications).doc(id!).get();
        if(result.exists) {
            return Promise.resolve({
                success:true,
                message: "Notification found",
                status:200,
                data: result.data() as Notification
            });
        } else {
            return {
                success:false,
                message: "Notification Not found",
                status:404,
            };
        }
    } catch (error) {
        return {
            success:false,
            message: " Failed to get Label " + (error as any).message,
            status:500
        };
    }
}

export const deleteNotification = async(id?:string): Promise<DBResponse<string>> => {
    if(!id){
        return {
            success:false,
            message:"Notification ID is required",
            status:400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.notifications).doc(id!).delete();
        return{
            success:true,
            message:"Notification deleted successfully",
            status:200,
            data:id!,
        };
    } catch (error) {
        return{
            success:false,
            message: "failed to delete notification " + (error as any).message,
            status:500
        }
        
    }
}

export const getAllNotifications = async (): Promise<DBResponse<Notification[]>> => {
    try {
        const snapshot = await firestoreAdmin.collection(DBPath.notifications).get();
        const notifications: Notification[] = [];
        snapshot.forEach((doc) => {
            notifications.push(doc.data() as Notification);
        })
        return {
            success:true,
            message:"Notifications fetched successfully",
            status:200,
            data:notifications,
        }
    } catch (error) {
        
        return{
            success:false,
            message:"Failed to fecth Notifications " + (error as any).message,
            status:400,
        };
    }
}

export const updateNotifications  = async(id:string, data:Partial<Notification>): Promise<DBResponse<Notification>> => {
if(!id){
    return{
        success:false,
        message:"Notification ID is required",
        status:400,
    }
}
try {
    const partialSchema = notificationSchema.fork(Object.keys(notificationSchema.describe().keys), (field) =>
    field.optional()
    );
    const validatedData = await partialSchema.validateAsync(
        {
            ...data,
            updatedAt:new Date(),
        },
        {abortEarly:false}
    );
    await firestoreAdmin.collection(DBPath.notifications).doc(id).update(validatedData);

    const updatedNotification = await getNotification(id);
    return {
        success:true,
        message:"Updated Notification successfully",
        status:200,
        data: updatedNotification.data,
    }
} catch (error) {
    return{
        success:false,
        message:"Failed to update Notification",
        status:500,
    }
}
}

