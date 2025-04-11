import {Activity} from '../../models/Activity';
import { DBResponse } from '../../types';
export interface IActivityDb {
    addActivity({}: {activity: Activity}): Promise<string>;
    getAllActivities(): Promise<Activity[]>;
    getActivity(id: string): Promise<Activity>;
    updateActivity(id: string, data: Activity): Promise<Activity>;
    getActivityByField(field: string, value: string): Promise<Activity[]>;
    deleteActivity(id: string): Promise<void>;
    getActivitiesByTask(taskId: string): Promise<Activity[]>;
    getActivitiesByUser(userId: string): Promise<Activity[]>;
    getActivitiesByAction(action: string): Promise<Activity[]>;
    getActivitiesByDetails(details: string): Promise<Activity[]>;
}
