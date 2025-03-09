export type Notification = {
    id:string;
    userId:string;
    message:string;
    type:string; // Example: "task", "reminder"
    read: boolean; // Has the notification been read?
    createdAt:Date;
    updatedAt:Date;
}