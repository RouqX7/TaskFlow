 import { Comment } from '../../models/Comment';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const commentSchema = Joi.object({
    id: Joi.string().required(),
    taskId: Joi.string().required(),
    userId: Joi.string().required(),
    content: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});

export const createComment = async (
    comment: Partial<Comment>,
    userId: string
): Promise<DBResponse<string>> => {
    try {
        if (!userId) {
            return {
                success: false,
                message: "User ID is required",
                status: 400,
            };
        }

        const commentWithDefaults = {
            id: uuidv4(),
            taskId: comment.taskId ?? "",
            userId: userId,
            content: comment.content ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Comment;

        const validatedComment = await commentSchema.validateAsync(commentWithDefaults, {
            abortEarly: false,
        });

        await firestoreAdmin
            .collection(DBPath.comments)
            .doc(validatedComment.id)
            .set(validatedComment);

        return {
            success: true,
            message: "Comment created successfully",
            status: 200,
            data: validatedComment.id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Validation failed: " + (error as any).message,
            status: 400,
        };
    }
};

export const getComment = async (id?: string): Promise<DBResponse<Comment>> => {
        if (!id) {
            return {
                success: false,
                message: "Comment ID is required",
                status: 400,
            };
        }
        try {
            const result = await firestoreAdmin.collection(DBPath.comments).doc(id!).get();
            if (result.exists) {
                return Promise.resolve({
                    success: true,
                    message: "Comment found",
                    status: 200,
                    data: result.data() as Comment
                });
            } else {
                return {
                    success: false,
                    message: "Comment not found",
                    status: 404
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed to get Comment: " + (error as any).message,
                status: 500
            };
        }
    }

    export const updateComment = async (id: string, data: Partial<Comment>): Promise<DBResponse<Comment>> => {
            if (!id) {
                return {
                    success: false,
                    message: "Comment ID is required",
                    status: 400,
                };
            }
            try {
                const partialSchema = commentSchema.fork(Object.keys(commentSchema.describe().keys), (field) =>
                    field.optional()
                );
                const validatedData = await partialSchema.validateAsync(
                    {
                        ...data,
                        updatedAt: new Date(),
                    },
                    { abortEarly: false }
                );
        
                await firestoreAdmin.collection(DBPath.comments).doc(id).update(validatedData);
        
                const updatedComment = await getComment(id); // Fetch updated task
                return {
                    success: true,
                    message: "Comment updated successfully",
                    status: 200,
                    data: updatedComment.data, // Return updated task
                };
            } catch (error) {
                return {
                    success: false,
                    message: "Failed to update Comment: " + (error as any).message,
                    status: 500,
                };
            }
        };

export const deleteComment = async (id: string): Promise<DBResponse<string>> => {
    if (!id) {
        return {
            success: false,
            message: "Comment ID is required",
            status: 400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.comments).doc(id).delete();
        return {
            success: true,
            message: "Comment deleted successfully",
            status: 200,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete Comment: " + (error as any).message,
            status: 500,
        };
    }
};

export const getAllComments = async (): Promise<DBResponse<Comment[]>> => {
    try {
        const result = await firestoreAdmin.collection(DBPath.comments).get();
        const comments: Comment[] = [];
        result.forEach((doc) => {
            comments.push(doc.data() as Comment);
        });
        return {
            success: true,
            message: "Comments found",
            status: 200,
            data: comments,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to get Comments: " + (error as any).message,
            status: 500,
        };
    }
};



