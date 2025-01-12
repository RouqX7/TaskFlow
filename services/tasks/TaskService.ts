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
    assignedTo: Joi.string().allow("", null).default(""), // Allow "" or null
    assignedBy: Joi.string().required(), // Always required as userId
    status: Joi.string().valid("pending", "in-progress", "completed").required(),
    priority: Joi.string().valid("low", "medium", "high").default("medium"),
    dueDate: Joi.date().default(null),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});


export const createTask = async (task: Partial<Task>, userId: string): Promise<DBResponse<string>> => {
   if(!userId){
         return {
              success: false,
              message: "User ID is required",
              status: 400,
         };
        }
    try {
        const taskWithDefaults = {
            id: uuidv4(),
            title: task.title ?? "",
            description: task.description ?? "",
            assignedTo: task.assignedTo ?? "", // This should be a userId
            assignedBy: userId, // Always set to the creator
            status: task.status ?? "pending",
            priority: task.priority ?? "medium",
            dueDate: task.dueDate ?? null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Task;

        const validatedTask = await taskSchema.validateAsync(taskWithDefaults, { abortEarly: false });

        await firestoreAdmin.collection(TASKS_COLLECTION).doc(validatedTask.id).set(validatedTask);

        return {
            success: true,
            message: "Task added successfully",
            status: 200,
            data: validatedTask.id,
        };
    } catch (error) {
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

    export const updateTask = async (id: string, data: Partial<Task>): Promise<DBResponse<Task>> => {
        if (!id) {
            return {
                success: false,
                message: "Task ID is required",
                status: 400,
            };
        }
        try {
            const partialSchema = taskSchema.fork(Object.keys(taskSchema.describe().keys), (field) =>
                field.optional()
            );
            const validatedData = await partialSchema.validateAsync(
                {
                    ...data,
                    updatedAt: new Date(),
                },
                { abortEarly: false }
            );
    
            await firestoreAdmin.collection(TASKS_COLLECTION).doc(id).update(validatedData);
    
            const updatedTask = await getTask(id); // Fetch updated task
            return {
                success: true,
                message: "Task updated successfully",
                status: 200,
                data: updatedTask.data, // Return updated task
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to update task: " + (error as any).message,
                status: 500,
            };
        }
    };
    
    
    

    export const deleteTask = async (id: string): Promise<DBResponse<Task | void>> => {
        if (!id) {
            return {
                success: false,
                message: "Task ID is required",
                status: 400,
            };
        }
        try {
            const deletedTask = await getTask(id); // Fetch task before deleting
    
            await firestoreAdmin.collection(TASKS_COLLECTION).doc(id).delete();
            return {
                success: true,
                message: "Task deleted successfully",
                status: 200,
                data: deletedTask.data, // Optionally return deleted task data
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to delete task: " + (error as any).message,
                status: 500,
            };
        }
    };
    

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


    const queryTasksByField = async (field: string, value: any): Promise<DBResponse<Task[]>> => {
        try {
            const result = await firestoreAdmin
                .collection(TASKS_COLLECTION)
                .where(field, "==", value)
                .get();
    
            const tasks: Task[] = result.docs.map(doc => doc.data() as Task);
    
            return {
                success: true,
                message: "Tasks retrieved successfully",
                status: 200,
                data: tasks
            };
        } catch (error) {
            return {
                success: false,
                message: "Failed to retrieve tasks: " + (error as any).message,
                status: 500
            };
        }
    };

    export const getTasksByUser = async (userId: string): Promise<DBResponse<Task[]>> => {
        if (!userId) {
            return {
                success: false,
                message: "User ID is required",
                status: 400,
            };
        }
        return queryTasksByField("assignedTo", userId);
    };

    export const getTasksByStatus = async (status: string): Promise<DBResponse<Task[]>> => {
        if (!status) {
            return {
                success: false,
                message: "Status is required",
                status: 400,
            };
        }
        return queryTasksByField("status", status);
    };
    
    export const getTasksByAssignee = async (assignee: string): Promise<DBResponse<Task[]>> => {
        if (!assignee) {
            return {
                success: false,
                message: "Assignee is required",
                status: 400,
            };
        }
        return queryTasksByField("assignedTo", assignee);
    };
    

