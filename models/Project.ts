export type Project = {
    id: string; 
    title: string; 
    description: string; 
    createdBy: string; // User ID of the creator
    teamMembers: string[]; // List of user IDs associated with the project
    createdAt: Date; 
    updatedAt: Date; 
};
