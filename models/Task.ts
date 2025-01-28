export type Task = {
    id: string;
    title: string;
    description?: string;
    status: "pending" | "in-progress" | "completed";
    assignedTo?: string;
    assignedBy: string;
    createdAt: Date;
    updatedAt?: Date;
    dueDate?: Date;
    priority?: "low" | "medium" | "high";
    projectId?: string;
    labels?: string[]; 
  };
  