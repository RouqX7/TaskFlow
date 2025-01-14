import { createTask, getTask } from './TaskService'; // Adjust the path as necessary
import { Task } from '../../models/Task';
import { DBResponse } from '../../types';

jest.mock('../../config/firebase_config', () => ({
    firestoreAdmin: {
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValue({}),
    },
}));

describe('TaskService', () => {
    describe('createTask', () => {
        const task: Partial<Task> = {
            id: 'test-task-id',
            title: 'Test Task',
            description: 'This is a test task',
            assignedTo: 'test-user-id',
            assignedBy: ' test-user-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            projectId: 'test-project-id',
            status: 'pending',
            priority: 'low',
            dueDate: new Date(),

        };
        const userId = 'test-user-id';

        it('should return an error if userId is not provided', async () => {
            const response = await createTask(task, '');
            expect(response.success).toBe(false);
            expect(response.message).toBe('User ID is required');
            expect(response.status).toBe(400);
        });

        // it('should create a task with createdAt and updatedAt fields', async () => {
        //     const response: DBResponse<string> = await createTask(task, userId);
        //     expect(response.success).toBe(true);
        //     expect(response.data).toBeDefined();
            
        //     if (typeof response.data === 'string') {
        //         try {
        //             const taskData: Partial<Task> = JSON.parse(response.data);
        //             expect(taskData.createdAt).toBeDefined();
        //             expect(taskData.updatedAt).toBeDefined();
        //         } catch (e) {
        //             fail(`response.data is not valid JSON: ${response.data}`);
        //         }
        //     }
        // });

        it('should return an error if task validation fails', async () => {
            const response = await createTask({}, userId);
            expect(response.success).toBe(false);
            expect(response.message).toContain('Validation failed');
            expect(response.status).toBe(400);
        });

        it('should create a task successfully', async () => {
            const response = await createTask(task, userId);
            expect(response.success).toBe(true);
            expect(response.message).toBe('Task added successfully');
            expect(response.status).toBe(200);
            expect(response.data).toBeTruthy();
        });
    });

    // getTask tests go here

    describe('getTask', () => {
        it('should return an error if no task ID is provided', async () => {
            const response = await getTask();
            expect(response.success).toBe(false);
            expect(response.message).toBe('Task ID is required');
            expect(response.status).toBe(400);
        });

        it('should return an error if the task ID is not found', async () => {
            const response = await getTask('non-existent-id');
            expect(response.success).toBe(false);
            expect(response.message).toBe('Task not found');
            expect(response.status).toBe(404);
        });

        it('should return the task if it is found', async () => {
            const task: Task = {
                id: 'test-task-id',
                title: 'Test Task',
                description: 'This is a test task',
                assignedTo: 'test-user-id',
                assignedBy: ' test-user-id',
                createdAt: new Date(),
                updatedAt: new Date(),
                projectId: 'test-project-id',
                status: 'pending',
                priority: 'low',
                dueDate: new Date(),
            };
            const response = await getTask(task.id);
            expect(response.success).toBe(true);
            expect(response.message).toBe('Task found');
            expect(response.status).toBe(200);
            expect(response.data).toEqual(task);
        });

        //if result.exists is false
        it('should return an error if the task ID is not found', async () => {
            const response = await getTask('non-existent-id');
            expect(response.success).toBe(false);
            expect(response.message).toBe('Task not found');
            expect(response.status).toBe(404);
        });
        


        // Add more tests for getTask here
    });

    


    
});
