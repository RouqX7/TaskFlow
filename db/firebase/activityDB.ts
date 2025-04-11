import { Activity } from "../../models/Activity";
import { DBResponse } from "../../types";
import { IActivityDb } from "../interfaces/IActivityDb";
import { firestoreAdmin } from "../../config/firebase_config";
import { DBPath } from "../../config/constants";

export default class ActivityDB implements IActivityDb {
    getActivitiesByTask(taskId: string): Promise<Activity[]> {
        return this.getActivityByField('taskId', taskId);
    }
    getActivitiesByUser(userId: string): Promise<Activity[]> {
        return this.getActivityByField('userId', userId);
    }
    getActivitiesByAction(action: string): Promise<Activity[]> {
        return this.getActivityByField('action', action);
    }
    getActivitiesByDetails(details: string): Promise<Activity[]> {
        return this.getActivityByField('details', details);
    }
    getActivity = async (id: string): Promise<Activity> => {
        if (!id) {
            throw new Error("Activity ID is required");
        }
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.activities).doc(id).get();
            if (!snapshot.exists) {
                throw new Error("Activity not found");
            }
            return snapshot.data() as Activity;
        } catch (error) {
            console.error('Error fetching activity:', error);
            throw error;
        }
    }
    updateActivity = async(id: string, data: Activity): Promise<Activity> => {
        if (!id) {
            throw new Error("Activity ID is required");
        }
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.activities).doc(id).get();
            if (!snapshot.exists) {
                throw new Error("Activity not found");
            }
            const activity = snapshot.data() as Activity;
            const updatedActivity = {
                ...activity,
                ...data,
                updatedAt: new Date(),
            };
            await firestoreAdmin.collection(DBPath.activities).doc(id).set(updatedActivity);
            return updatedActivity;
        } catch (error) {
            console.error('Error updating activity:', error);
            throw error;
        }
    }
    deleteActivity = async(id: string): Promise<void> => {
        if (!id) {
            throw new Error("Activity ID is required");
        }
        try {
            await firestoreAdmin.collection(DBPath.activities).doc(id!).delete();
            return;
        } catch (error) {
            console.error('Error deleting activity:', error);
            throw error;
        }
    }
    getActivityByField = async(field: string, value: string): Promise<Activity[]> => {
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.activities).where(field, '==', value).get();
        const activities: Activity[] = [];
        snapshot.forEach((doc) => {
            activities.push(doc.data() as Activity);
        });
        return activities;
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }
    getAllActivities = async(): Promise<Activity[]> => {
        try {
            const snapshot = await firestoreAdmin.collection(DBPath.activities).get();
            const activities: Activity[] = [];
            snapshot.forEach((doc) => {
                activities.push(doc.data() as Activity);
            });
            return activities;
        } catch (error) {
            console.error('Error fetching activities:', error);
            throw error;
        }
    }
    
    addActivity = async({activity}: { activity: Activity; }): Promise<string> => {
        if (!activity || !activity.id) {
            throw new Error("Activity or activity ID is missing");
        }

        try {
            await firestoreAdmin
                .collection(DBPath.activities)
                .doc(activity.id)
                .set(activity);
            return activity.id;
        } catch (error) {
            console.error('Error adding activity:', error);
            throw error;
        }
    }
}
