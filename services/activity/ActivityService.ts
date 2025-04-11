import{Activity, activitySchema} from '../../models/Activity';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import { v4 as uuidv4 } from "uuid";
import { DataProvider } from '../../src/providers';
import {serviceValidators} from '../../utilities/serviceUtilities';

export const createActivity = async (
    activity: Activity,
): Promise<DBResponse<string>> => {
    return await serviceValidators<Activity,string>({
        schema: activitySchema,
        message: "Activity created successfully",
        errorMessage: "Activity creation failed",
        data: activity,
        next: async (validatedActivity: Activity) => {
            const result = await DataProvider.activityDB.addActivity({ activity: validatedActivity });
            return result;
        }
    });
};

export const getAllActivities = async (): Promise<DBResponse<Activity[]>> => {
       
    return await serviceValidators<void, Activity[]>({
        message: "Activities fetched successfully",
        errorMessage: "Failed to fetch activities",
        data: undefined,
        next: async () => {
            const result = await DataProvider.activityDB.getAllActivities();
            return result;
        }
    });
};

export const getActivity = async (id?: string): Promise<DBResponse<Activity>> => {
    return await serviceValidators<string, Activity>({
        message: "Activity fetched successfully",
        errorMessage: "Failed to fetch activity",
        data: id,
        next: async (validatedId: string) => {
            const result = await DataProvider.activityDB.getActivity(validatedId);
            return result;
        }
    });
}

export const deleteActivity = async (id?: string): Promise<DBResponse<string>> => {
    return await serviceValidators<string, string>({
        message: "Activity deleted successfully",
        errorMessage: "Failed to delete activity",
        data: id,
        next: async (validatedId: string) => {
            await DataProvider.activityDB.deleteActivity(validatedId);
            return validatedId; 
        }
    });
}

export const updateActivity = async (id: string, data: Activity): Promise<DBResponse<Activity>> => {
    return await serviceValidators<Activity, Activity>(
        {
            message: "Activity updated successfully",
            errorMessage: "Failed to update activity",
            data: data,
            next: async (validatedData: Activity) => {
                const result = await DataProvider.activityDB.updateActivity(id, validatedData);
                return result;
            }
        }
    );
};

export const getActivityByField = async (field: string, value: string): Promise<DBResponse<Activity[]>> => {
    return await serviceValidators<string, Activity[]>(
        {
            message: "Activities fetched successfully",
            errorMessage: "Failed to fetch activities",
            data: undefined,
            next: async () => {
                const result = await DataProvider.activityDB.getActivityByField(field, value);
                return result;
            }
        }
    );
};

export const getActivitiesByTask = async (taskId: string): Promise<DBResponse<Activity[]>> => {
    return await serviceValidators<string, Activity[]>({
        message: "Activities fetched successfully",
        errorMessage: "Failed to fetch activities by task",
        data: taskId,
        next: async (validatedId: string) => {
            const result = await DataProvider.activityDB.getActivitiesByTask(validatedId);
            return result;
        }
    });
};

export const getActivitiesByUser = async (userId: string): Promise<DBResponse<Activity[]>> => {
    return await serviceValidators<string, Activity[]>({
        message: "Activities fetched successfully",
        errorMessage: "Failed to fetch activities by user",
        data: userId,
        next: async (validatedId: string) => {
            const result = await DataProvider.activityDB.getActivitiesByUser(validatedId);
            return result;
        }
    });
};

export const getActivitiesByAction = async (action: string): Promise<DBResponse<Activity[]>> => {
    return await serviceValidators<string, Activity[]>({
        message: "Activities fetched successfully",
        errorMessage: "Failed to fetch activities by action",
        data: action,
        next: async (validatedAction: string) => {
            const result = await DataProvider.activityDB.getActivitiesByAction(validatedAction);
            return result;
        }
    });
};

export const getActivitiesByDetails = async (details: string): Promise<DBResponse<Activity[]>> => {
    return await serviceValidators<string, Activity[]>({
        message: "Activities fetched successfully",
        errorMessage: "Failed to fetch activities by details",
        data: details,
        next: async (validatedDetails: string) => {
            const result = await DataProvider.activityDB.getActivitiesByDetails(validatedDetails);
            return result;
        }
    });
};
