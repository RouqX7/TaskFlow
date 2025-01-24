import { v4 as uuidv4 } from "uuid";
import { Project } from "../../models/Project";
import { DBResponse } from "../../types"; 
import { firestoreAdmin } from "../../config/firebase_config";
import { DBPath } from "../../config/constants";
import Joi from "joi";

export const projectSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().allow("").optional(),
    createdBy: Joi.string().required(),
    teamMembers: Joi.array().items(Joi.string()).default([]),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
});

export const createProject = async (
    project: Partial<Project>,
    userId: string
): Promise<DBResponse<string>> => {
    try {
        if (!userId) {
            return {
                success: false,
                message: "User ID is required",
                status: 400,
            };
        }

        const projectWithDefaults = {
            id: uuidv4(),
            title: project.title ?? "",
            description: project.description ?? "",
            createdBy: userId,
            teamMembers: project.teamMembers ?? [],
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Project;

        const validatedProject = await projectSchema.validateAsync(projectWithDefaults, {
            abortEarly: false,
        });

        await firestoreAdmin
            .collection(DBPath.project)
            .doc(validatedProject.id)
            .set(validatedProject);

        return {
            success: true,
            message: "Project created successfully",
            status: 200,
            data: validatedProject.id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Validation failed: " + (error as any).message,
            status: 400,
        };
    }
};

export const getProjectById = async (id?: string): Promise<DBResponse<Project>> => {
    if (!id) {
        return {
            success: false,
            message: "Project ID is required",
            status: 400,
        };
    }

    try {
        const project = await firestoreAdmin.collection(DBPath.project).doc(id).get();
        if (!project.exists) {
            return {
                success: false,
                message: "Project not found",
                status: 404,
            };
        }

        return {
            success: true,
            message: "Project found",
            status: 200,
            data: project.data() as Project,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error fetching project: " + (error as any).message,
            status: 500,
        };
    }
}

export const getProjectsByUser = async (userId: string): Promise<DBResponse<Project[]>> => {
    try {
        const projects = await firestoreAdmin
            .collection(DBPath.project)
            .where("createdBy", "==", userId)
            .get();

        if (projects.empty) {
            return {
                success: false,
                message: "No projects found",
                status: 404,
            };
        }

        const projectList: Project[] = [];
        projects.forEach((project) => {
            projectList.push(project.data() as Project);
        });

        return {
            success: true,
            message: "Projects found",
            status: 200,
            data: projectList,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error fetching projects: " + (error as any).message,
            status: 500,
        };
    }
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<DBResponse<Project>> => {
    if(!id) {
        return {
            success: false,
            message: "Project ID is required",
            status: 400,
        };
    }
    try{
        const partialSchema = projectSchema.fork(Object.keys(projectSchema.describe().keys), (field) =>
            field.optional()
        );
        const validatedProject = await partialSchema.validateAsync(
            {
            ...data, 
        updatedAt: new Date(),
    }, 
    {
            abortEarly: false,
        });

        await firestoreAdmin.collection(DBPath.project).doc(id).update(validatedProject);

        const updatedProject = await  getProjectById(id);
        return {
            success: true,
            message: "Project updated successfully",
            status: 200,
            data: updatedProject.data,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error updating project: " + (error as any).message,
            status: 500,
        };
    }
};

export const deleteProject = async (projectId: string): Promise<DBResponse<string>> => {
    try {
        const projectRef = firestoreAdmin.collection(DBPath.project).doc(projectId);
        const existingProject = await projectRef.get();

        if (!existingProject.exists) {
            return {
                success: false,
                message: "Project not found",
                status: 404,
            };
        }

        await projectRef.delete();

        return {
            success: true,
            message: "Project deleted successfully",
            status: 200,
            data: projectId,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error deleting project: " + (error as any).message,
            status: 500,
        };
    }
};

export const addTeamMember = async (
    projectId: string,
    userId: string
): Promise<DBResponse<string>> => {
    try {
        const projectRef = firestoreAdmin.collection(DBPath.project).doc(projectId);
        const project = await projectRef.get();

        if (!project.exists) {
            return {
                success: false,
                message: "Project not found",
                status: 404,
            };
        }

        const projectData = project.data() as Project;
        if (projectData.teamMembers.includes(userId)) {
            return {
                success: false,
                message: "User is already a team member",
                status: 400,
            };
        }

        projectData.teamMembers.push(userId);
        await projectRef.set(projectData);

        return {
            success: true,
            message: "Team member added successfully",
            status: 200,
            data: projectId,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error adding team member: " + (error as any).message,
            status: 500,
        };
    }
};

export const removeTeamMember = async (
    projectId: string,
    userId: string
): Promise<DBResponse<string>> => {
    try {
        const projectRef = firestoreAdmin.collection(DBPath.project).doc(projectId);
        const project = await projectRef.get();

        if (!project.exists) {
            return {
                success: false,
                message: "Project not found",
                status: 404,
            };
        }

        const projectData = project.data() as Project;
        if (!projectData.teamMembers.includes(userId)) {
            return {
                success: false,
                message: "User is not a team member",
                status: 400,
            };
        }

        projectData.teamMembers = projectData.teamMembers.filter((member) => member !== userId);
        await projectRef.set(projectData);

        return {
            success: true,
            message: "Team member removed successfully",
            status: 200,
            data: projectId,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error removing team member: " + (error as any).message,
            status: 500,
        };
    }
};

export const getAllProjects = async (): Promise<DBResponse<Project[]>> => {
    try {
        const projects = await firestoreAdmin.collection(DBPath.project).get();
        if (projects.empty) {
            return {
                success: false,
                message: "No projects found",
                status: 404,
            };
        }

        const projectList: Project[] = [];
        projects.forEach((project) => {
            projectList.push(project.data() as Project);
        });

        return {
            success: true,
            message: "Projects found",
            status: 200,
            data: projectList,
        };
    } catch (error) {
        return {
            success: false,
            message: "Error fetching projects: " + (error as any).message,
            status: 500,
        };
    }
}

