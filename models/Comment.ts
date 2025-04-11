import Joi from "joi";
import { v4 as uuidv4 } from "uuid";

export type TaskComment =  {
    id: string; // UUID for the comment
    taskId: string; // Reference to the task
    userId: string; // Reference to the user who commented
    content: string; // The actual comment text
    createdAt: Date;
    updatedAt: Date;
}

export const commentSchema = Joi.object({
    id: Joi.string().default(() => uuidv4()),
    taskId: Joi.string().required(),
    userId: Joi.string().required(),
    content: Joi.string().default(""),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});
