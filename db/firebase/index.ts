import { IDB } from "../interfaces";
import { IActivityDb } from "../interfaces/IActivityDb";
import ActivityDB from "./activityDB";

export default class FirebaseDB implements IDB  {
    activityDB: IActivityDb = new ActivityDB();   
}