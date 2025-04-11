import { Activity } from "../../models/Activity";
import { DBResponse } from "../../types";
import { IActivityDb } from "../interfaces/IActivityDb";
import { firestoreAdmin } from "../../config/firebase_config";
import { DBPath } from "../../config/constants";

export default class ActivityDB implements IActivityDb {
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
