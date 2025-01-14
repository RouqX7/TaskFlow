export type Project = {
    id: string; // Unique project ID
    title: string; // Title of the project
    description: string; // Description of the project
    createdBy: string; // User ID of the creator
    teamMembers: string[]; // List of user IDs associated with the project
    createdAt: Date; // Timestamp when the project was created
    updatedAt: Date; // Timestamp for the last update
};
