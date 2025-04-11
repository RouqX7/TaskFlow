import Joi from "joi";
import { v4 as uuidv4 } from 'uuid';

export type Activity = {
    id: string;
    taskId: string; // Reference to the task
    userId: string; // User who performed the action
    action: string; // Example: "Created", "Updated", "Completed"
    details: string; // Optional description of the change
    createdAt: Date;
    updatedAt?: Date;
};

export const activitySchema = Joi.object<Activity>({
    id: Joi.string().default(() => uuidv4()),
    taskId: Joi.string().required(),
    userId: Joi.string().required(),
    action: Joi.string().default(""),
    details: Joi.string().default(""),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});
