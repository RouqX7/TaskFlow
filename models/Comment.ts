export type Comment =  {
    id: string; // UUID for the comment
    taskId: string; // Reference to the task
    userId: string; // Reference to the user who commented
    content: string; // The actual comment text
    createdAt: Date;
    updatedAt: Date;
}