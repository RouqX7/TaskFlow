import {Activity} from '../../models/Activity';
import { DBResponse } from '../../types';
export interface IActivityDb {
                //type
    addActivity({}: {activity: Activity}): Promise<string>;
} 

