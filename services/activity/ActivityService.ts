import{Activity} from '../../models/Activity';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";

export const activitySchema = Joi.object({
    id: Joi.string().required(),
    taskId: Joi.string().required(),
    userId: Joi.string().required(),
    action: Joi.string().required(),
    details: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});

export const createActivity = async (
    activity: Partial<Activity>,
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

        const activityWithDefaults = {
            id: uuidv4(),
            taskId: activity.taskId ?? "",
            userId: userId,
            action: activity.action ?? "",
            details: activity.details ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Activity;

        const validatedActivity = await activitySchema.validateAsync(activityWithDefaults, {
            abortEarly: false,
        });

        await firestoreAdmin
            .collection(DBPath.activities)
            .doc(validatedActivity.id)
            .set(validatedActivity);

        return {
            success: true,
            message: "Activity created successfully",
            status: 200,
            data: validatedActivity.id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Validation failed: " + (error as any).message,
            status: 400,
        };
    }
};

export const getAllActivities = async (): Promise<DBResponse<Activity[]>> => {
    try {
        const snapshot = await firestoreAdmin.collection(DBPath.activities).get();
        const activities: Activity[] = [];
        snapshot.forEach((doc) => {
            activities.push(doc.data() as Activity);
        });

        return {
            success: true,
            message: "Activities fetched successfully",
            status: 200,
            data: activities,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch activities: " + error,
            status: 400,
        };
    }
};

export const getActivity = async (id?: string): Promise<DBResponse<Activity>> => {
    if (!id) {
        return {
            success: false,
            message: "Activity ID is required",
            status: 400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.activities).doc(id!).get();
        if (result.exists) {
            return Promise.resolve({
                success: true,
                message: "Activity found",
                status: 200,
                data: result.data() as Activity
            });
        } else {
            return {
                success: false,
                message: "Activity not found",
                status: 404
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to get Activity: " + (error as any).message,
            status: 500
        };
    }
}

export const deleteActivity = async (id?: string): Promise<DBResponse<string>> => { 
    if (!id) {
        return {
            success: false,
            message: "Activity ID is required",
            status: 400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.activities).doc(id!).delete();
        return {
            success: true,
            message: "Activity deleted successfully",
            status: 200,
            data: id!,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete activity: " + (error as any).message,
            status: 500,
        };
    }
}

export const updateActivity = async (id: string, data: Partial<Activity>): Promise<DBResponse<Activity>> => {
    if (!id) {
        return {
            success: false,
            message: "Activity ID is required",
            status: 400,
        };
    }
    try {
        const partialSchema = activitySchema.fork(Object.keys(activitySchema.describe().keys), (field) =>
            field.optional()
        );
        const validatedData = await partialSchema.validateAsync(
            {
                ...data,
                updatedAt: new Date(),
            },
            { abortEarly: false }
        );

        await firestoreAdmin.collection(DBPath.activities).doc(id).update(validatedData);

        const updatedActivity = await getActivity(id); // Fetch updated task
        return {
            success: true,
            message: "Updated Activity successfully",
            status: 200,
            data: updatedActivity.data, // Return updated task
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update Activity: " + (error as any).message,
            status: 500,
        };
    }
};

export const getActivityByField = async (field: string, value: string): Promise<DBResponse<Activity[]>> => {
    try {
        const snapshot = await firestoreAdmin.collection(DBPath.activities).where(field, '==', value).get();
        const activities: Activity[] = [];
        snapshot.forEach((doc) => {
            activities.push(doc.data() as Activity);
        });

        return {
            success: true,
            message: "Activities fetched successfully",
            status: 200,
            data: activities,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch activities: " + error,
            status: 400,
        };
    }
};

export const getActivitiesByTask = async (taskId: string): Promise<DBResponse<Activity[]>> => {
    return getActivityByField('taskId', taskId);
};

export const getActivitiesByUser = async (userId: string): Promise<DBResponse<Activity[]>> => {
    return getActivityByField('userId', userId);
};

export const getActivitiesByAction = async (action: string): Promise<DBResponse<Activity[]>> => {
    return getActivityByField('action', action);
};

export const getActivitiesByDetails = async (details: string): Promise<DBResponse<Activity[]>> => {
    return getActivityByField('details', details);
};

