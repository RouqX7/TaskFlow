export type Activity = {
    id: string;
    taskId: string; // Reference to the task
    userId: string; // User who performed the action
    action: string; // Example: "Created", "Updated", "Completed"
    details: string; // Optional description of the change
    createdAt: Date;
    updatedAt?: Date;
};