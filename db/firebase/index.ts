import { IDB } from "../interfaces";
import { IActivityDb } from "../interfaces/IActivityDb";
import { ICommentDB } from "../interfaces/ICommentDB";
import ActivityDB from "./activityDB";
import CommentDB from "./commentDB";
export default class FirebaseDB implements IDB  {
    activityDB: IActivityDb = new ActivityDB();   
    commentDB: ICommentDB = new CommentDB();
}