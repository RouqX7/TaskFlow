import { Label } from '../../models/Label';
import { DBResponse } from '../../types';
import { firestoreAdmin } from '../../config/firebase_config';
import { DBPath } from '../../config/constants';
import Joi from 'joi';
import { v4 as uuidv4 } from "uuid";
import e from 'express';

export const labelSchema = Joi.object({ 
    id: Joi.string().required(),
    name: Joi.string().required(),
    color: Joi.string().required(),
    createdAt: Joi.date().default(() => new Date()),
    updatedAt: Joi.date().default(() => new Date()),
    createdBy: Joi.string().required(),
});

export const createLabel = async (
    label: Partial<Label>,
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

        const labelWithDefaults = {
            id: uuidv4(),
            name: label.name ?? "",
            color: label.color ?? "",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: userId,
        } as Label;

        const validatedLabel = await labelSchema.validateAsync(labelWithDefaults, {
            abortEarly: false,
        });

        await firestoreAdmin
            .collection(DBPath.labels)
            .doc(validatedLabel.id)
            .set(validatedLabel);

        return {
            success: true,
            message: "Label created successfully",
            status: 200,
            data: validatedLabel.id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Validation failed: " + (error as any).message,
            status: 400,
        };
    }
}

export const getAllLabels = async (): Promise<DBResponse<Label[]>> => {
    try {
        const labels: Label[] = [];
        const snapshot = await firestoreAdmin.collection(DBPath.labels).get();
        snapshot.forEach((doc) => {
            labels.push(doc.data() as Label);
        });

        return {
            success: true,
            message: "Labels fetched successfully",
            status: 200,
            data: labels,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch labels: " + (error as any).message,
            status: 500,
        };
    }
}

export const getLabel = async (id?: string): Promise<DBResponse<Label>> => {
    if (!id) {
        return {
            success: false,
            message: "Label ID is required",
            status: 400,
        };
    }
    try {
        const result = await firestoreAdmin.collection(DBPath.labels).doc(id!).get();
        if (result.exists) {
            return Promise.resolve({
                success: true,
                message: "Label found",
                status: 200,
                data: result.data() as Label
            });
        } else {
            return {
                success: false,
                message: "Label not found",
                status: 404
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "Failed to get label: " + (error as any).message,
            status: 500
        };
    }
}



export const updateLabel = async (id: string, data: Partial<Label>): Promise<DBResponse<Label>> => {
    if (!id) {
        return {
            success: false,
            message: "Label ID is required",
            status: 400,
        };
    }
    try {
        const partialSchema = labelSchema.fork(Object.keys(labelSchema.describe().keys), (field) =>
            field.optional()
        );
        const validatedData = await partialSchema.validateAsync(
            {
                ...data,
                updatedAt: new Date(),
            },
            { abortEarly: false }
        );

        await firestoreAdmin.collection(DBPath.labels).doc(id).update(validatedData);

        const updatedLabel = await getLabel(id); // Fetch updated task
        return {
            success: true,
            message: "Label updated successfully",
            status: 200,
            data: updatedLabel.data, // Return updated task
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to update label: " + (error as any).message,
            status: 500,
        };
    }
};

export const deleteLabel = async (id: string): Promise<DBResponse<string>> => {
    if (!id) {
        return {
            success: false,
            message: "Label ID is required",
            status: 400,
        };
    }
    try {
        await firestoreAdmin.collection(DBPath.labels).doc(id).delete();
        return {
            success: true,
            message: "Label deleted successfully",
            status: 200,
            data: id,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to delete label: " + (error as any).message,
            status: 500,
        };
    }
};

const getLabelsByField = async (field: string, value: string): Promise<DBResponse<Label[]>> => {
    try {
        const labels: Label[] = [];
        const snapshot = await firestoreAdmin.collection(DBPath.labels).where(field, "==", value).get();
        snapshot.forEach((doc) => {
            labels.push(doc.data() as Label);
        });

        return {
            success: true,
            message: "Labels fetched successfully",
            status: 200,
            data: labels,
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to fetch labels: " + (error as any).message,
            status: 500,
        };
    }
}

export const getLabelsByUser = async (userId: string): Promise<DBResponse<Label[]>> => {
    return getLabelsByField("createdBy", userId);
}

export const getLabelsByName = async (name: string): Promise<DBResponse<Label[]>> => {
    return getLabelsByField("name", name);
}

export const getLabelsByColor = async (color: string): Promise<DBResponse<Label[]>> => {
    return getLabelsByField("color", color);
}

