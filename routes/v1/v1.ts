import { DatabaseProviderType } from "../../types";
import { Routes } from "../routePaths";
import { Router } from "express";
import AuthController from "../../services/auth/Auth.controller";
import { v1 } from "firebase-admin/firestore";
import { createTask, deleteTask, getTask, getTasks, getTasksByStatus, getTasksByUser, updateTask } from "../../services/tasks/TaskService";
import { createProject } from "../../services/project/ProjectService";

const v1Router = Router();

const provider: DatabaseProviderType = process.env
.DB_PROVIDER as DatabaseProviderType;

v1Router.get(Routes.health, (req, res) => {
    res.status(200).json({
        message: ' Welcome to TaskFlow v1: Server is up and running',
    });
});

const auth = new AuthController(provider);

v1Router.get(Routes.login,async (req,res) => {
    try {
        res.json(await auth.login(req.body));
    } catch (err:unknown) {
        const error = err as Error;
        res.status(500).send({
            status:"error",
            message: error.message,
        });
    }
});

v1Router.post(Routes.register, async (req,res) => {
    try {
        res.json(await auth.register(req.body));
    } catch (err:unknown) {
        const error = err as Error;
        res.status(500).send({
            status:"error",
            message: error.message,
        });
    }
});

v1Router.post(Routes.user, async (req, res) => {
    try {
      const response = await auth.addUser(req.body);
      res.json(response);
    } catch (err: unknown) {
      const error = err as Error;
      res.status(500).send({
        status: "error",
        message: error.message,
      });
    }
  });

  

  //tasks routes

  v1Router.post(Routes.tasks, async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await createTask(req.body, userId);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.taskList, async (req, res) => {
    try {
        const response = await getTasks();
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.delete(Routes.tasks, async (req, res) => {
    try {
        const id = req.query?.id as string | undefined;
        if (!id) {
            throw new Error("Task ID is required");
        }
        const response = await deleteTask(id);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

//taskById
v1Router.get(Routes.tasks, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getTask(id);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.put(Routes.tasks, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateTask(id, req.body);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
}
);

v1Router.get(Routes.tasksByUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await getTasksByUser(userId);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.tasksByStatus, async (req, res) => {
    try {
        const status = req.params.status;
        const response = await getTasksByStatus(status);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.tasksByAssignee, async (req, res) => {
    try {
        const assignee = req.params.assignee;
        const response = await getTasksByUser(assignee);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

//project routes

v1Router.post(Routes.projects, async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await createProject(req.body, userId);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});


export default v1Router;