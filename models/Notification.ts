import Joi from 'joi';

export type Notification = {
    id:string;
    userId:string;
    message:string;
    type:string; // Example: "task", "reminder"
    read: boolean; // Has the notification been read?
    createdAt:Date;
    updatedAt:Date;
}
export const notificationSchema = Joi.object<Notification>({
    id: Joi.string().required(),
    userId: Joi.string().required(),
    message: Joi.string().required(),
    type: Joi.string().required(),
    read: Joi.boolean().required(),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});
