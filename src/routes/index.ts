import { Router } from "express";
import { Routes } from "./routePaths";
const router = Router();

router.get(Routes.health,(req,res) => {
    res.status(200).send({
        message: 'Welcome to TaskFlow v1: Server is up and running!'
    })
});

export default router;