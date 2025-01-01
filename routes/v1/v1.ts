import { DatabaseProviderType } from "../../types";
import { Routes } from "../routePaths";
import { Router } from "express";
import AuthController from "../../services/auth/Auth.controller";
import { v1 } from "firebase-admin/firestore";
import { createTask, deleteTask, getTasks } from "../../services/tasks/TaskService";

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
        const response = await createTask(req.body);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.tasks, async (req, res) => {
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

v1Router.get(Routes.tasks, async (req, res) => {
    try {
        const response = await deleteTask(req.params.id);
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