import exp from "constants";
import { firestoreAdmin } from "../../config/firebase_config";
import Log from "../../helpers/logger";
import { DBResponse } from "../../types";
import { Task } from "../../models/Task";
import { v4 as uuidv4 } from "uuid"; 
import Joi from "joi";

const TASKS_COLLECTION = "tasks";

// Define the schema for Task
const taskSchema = Joi.object({
    id: Joi.string().optional(),
    title: Joi.string().required(),
    description: Joi.string().default(""),
    assignedTo: Joi.string().default(""),
    status: Joi.string().valid("pending", "in-progress", "completed").required(),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    dueDate: Joi.date().default(null),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});


export const createTask = async (task: Partial<Task>): Promise<DBResponse<string>> => {
    try {
        // Add a generated ID to the task
        const taskWithDefaults = {
            id: uuidv4(),
            title: task.title ?? "",
            description: task.description ?? "", 
            assignedTo: task.assignedTo ?? "", 
            status: task.status ?? "pending", 
            priority: task.priority ?? "low", 
            dueDate: task.dueDate ?? null,
            createdAt: new Date(), 
            updatedAt: new Date(), 
        };

        // Validate task input with schema
        const validatedTask = await taskSchema.validateAsync(taskWithDefaults, { abortEarly: false });

        // Add to Firestore
        await firestoreAdmin.collection(TASKS_COLLECTION).doc(validatedTask.id).set(validatedTask);

        return {
            success: true,
            message: "Task added successfully",
            status: 200,
            data: validatedTask.id, // Return the ID for reference
        };
    } catch (error) {
        // Joi error handling
        return {
            success: false,
            message: "Validation failed: " + (error as any).message,
            status: 400,
        };
    }
};


    export const getTask = async (id?: string): Promise<DBResponse<Task>> => {
        if (!id) {
            return {
                success: false,
                message: "Task ID is required",
                status: 400,
            };
        }
        try {
            const result = await firestoreAdmin.collection(TASKS_COLLECTION).doc(id!).get();
            if (result.exists) {
                return Promise.resolve({
                    success: true,
                    message: "Task found",
                    status: 200,
                    data: result.data() as Task
                });
            } else {
                return {
                    success: false,
                    message: "Task not found",
                    status: 404
                };
            }
        } catch (error) {
            return {
                success: false,
                message: "Failed to get task: " + (error as any).message,
                status: 500
            };
        }
    }

    export const updateTask = async (id: string,data: Record<string, unknown>): Promise<DBResponse<Task>> => {
        if(!id) {
            return {
                success: false,
                message: "Task ID is required",
                status: 400
            };
        }
        try {
            const result = await firestoreAdmin.collection(TASKS_COLLECTION).doc(id).update(data);
            const task = await getTask(id);
            Log.quiet("Task updated successfully:", result.writeTime );
            return Promise.resolve({
                success: true,
                message: "Task updated successfully",
                status: 200,
                data: task.data
            });
        } catch (error) {
            Log.error("Failed to update task:", (error as any).message);
            return {
                success: false,
                message: "Failed to update task: " + (error as any).message,
                status: 500
            };
        }
    }

    export const deleteTask = async (taskId: string): Promise<DBResponse<void>> => {
        try {
            await firestoreAdmin.collection(TASKS_COLLECTION).doc(taskId).delete();
            return Promise.resolve({
                success: true,
                message: "Task deleted successfully",
                status: 200
            });
        } catch (error) {
            return {
                success: false,
                message: "Failed to delete task: " + (error as any).message,
                status: 500
            };
        }
    }

    export const getTasks = async (): Promise<DBResponse<Task[]>> => {
        try {
            const result = await firestoreAdmin.collection(TASKS_COLLECTION).get();
            const tasks: Task[] = [];
            result.forEach((doc) => {
                tasks.push(doc.data() as Task);
            });
            return Promise.resolve({
                success: true,
                message: "Tasks found",
                status: 200,
                data: tasks
            });
        } catch (error) {
            return {
                success: false,
                message: "Failed to get tasks: " + (error as any).message,
                status: 500
            };
        }
    }

    export const getTasksByStatus = async (status: Task["status"]): Promise<DBResponse<Task[]>> => {
        try {
            const result = await firestoreAdmin.collection(TASKS_COLLECTION).where("status", "==", status).get();
            const tasks: Task[] = [];
            result.forEach((doc) => {
                tasks.push(doc.data() as Task);
            });
            return Promise.resolve({
                success: true,
                message: "Tasks found",
                status: 200,
                data: tasks
            });
        } catch (error) {
            return {
                success: false,
                message: "Failed to get tasks: " + (error as any).message,
                status: 500
            };
        }
    }

    export const getTasksByAssignee = async (assignee: string): Promise<DBResponse<Task[]>> => {
        try {
            const result = await firestoreAdmin.collection(TASKS_COLLECTION).where("assignedTo", "==", assignee).get();
            const tasks: Task[] = [];
            result.forEach((doc) => {
                tasks.push(doc.data() as Task);
            });
            return Promise.resolve({
                success: true,
                message: "Tasks found",
                status: 200,
                data: tasks
            });
        } catch (error) {
            return {
                success: false,
                message: "Failed to get tasks: " + (error as any).message,
                status: 500
            };
        }
    }

