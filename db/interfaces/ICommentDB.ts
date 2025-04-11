import { TaskComment } from "../../models/Comment";

export interface ICommentDB {
    addComment({}: {comment: TaskComment}): Promise<string>;
    getAllComments(): Promise<TaskComment[]>;
    getComment(id: string): Promise<TaskComment>;
    updateComment(id: string, data: TaskComment): Promise<TaskComment>;
    getCommentByField(field: string, value: string): Promise<TaskComment[]>;
    deleteComment(id: string): Promise<void>;
    getCommentsByTask(taskId: string): Promise<TaskComment[]>;
    getCommentsByUser(userId: string): Promise<TaskComment[]>;
    getCommentsByContent(content: string): Promise<TaskComment[]>;
    getCommentsByTaskAndUser(taskId: string, userId: string): Promise<TaskComment[]>;
}