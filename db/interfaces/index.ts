import { IActivityDb } from "./IActivityDb";
import { ICommentDB } from "./ICommentDB";

export interface IDB {
    activityDB: IActivityDb;
    commentDB: ICommentDB;
}