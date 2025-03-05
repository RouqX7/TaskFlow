import { DatabaseProviderType } from "../../types";
import { Routes } from "../routePaths";
import { Router } from "express";
import AuthController from "../../services/auth/Auth.controller";
import { v1 } from "firebase-admin/firestore";
import { createTask, deleteTask, getTask, getTasks, getTasksByStatus, getTasksByUser, updateTask } from "../../services/tasks/TaskService";
import { addTeamMember, createProject, getAllProjects, getProjectById, getProjectsByUser, removeTeamMember, updateProject } from "../../services/project/ProjectService";
import { createComment, getAllComments, getComment, getCommentsByTask, getCommentsByUser, updateComment } from "../../services/comment/CommentService";
import { createLabel, deleteLabel, getAllLabels, getLabel, getLabelsByColor, getLabelsByName, getLabelsByUser, updateLabel } from "../../services/labels/LabelService";
import { createActivity, deleteActivity, getActivitiesByAction, getActivitiesByDetails, getActivitiesByTask, getActivitiesByUser, getAllActivities, updateActivity } from "../../services/activity/ActivityService";
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


v1Router.get(Routes.projectList, async (req, res) => {
    try {
        const response = await getAllProjects();
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.delete(Routes.projects, async (req, res) => {
    try {
        const id = req.query?.id as string | undefined;
        if (!id) {
            throw new Error("Project ID is required");
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

//projectById

v1Router.get(Routes.projects, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getProjectById(id);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.put(Routes.projects, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateProject(id, req.body);
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

v1Router.post(Routes.addTeamMember, async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    const response = await addTeamMember(projectId, userId);
    res.status(response.status).json(response);
});

v1Router.post(Routes.removeTeamMember, async (req, res) => {
    const { projectId } = req.params;
    const { userId } = req.body;
    const response = await removeTeamMember(projectId, userId);
    res.status(response.status).json(response);
});

v1Router.get(Routes.getProjectsByUser, async (req, res) => {
    const { userId } = req.params;
    const response = await getProjectsByUser(userId);
    res.status(response.status).json(response);
});

v1Router.get(Routes.projects, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getProjectById(id);
        res.status(response.status).json(response);
        
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

//comment routes

v1Router.post(Routes.comment, async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await createComment(req.body, userId);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.comment, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getComment(id);
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

//update
v1Router.put(Routes.comment, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateComment(id, req.body);
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

v1Router.delete(Routes.comment, async (req, res) => {
    try {
        const id = req.query?.id as string | undefined;
        if (!id) {
            throw new Error("Comment ID is required");
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

v1Router.get(Routes.commentList, async (req, res) => {
    try {
        const response = await getAllComments();
        res.status(response.status).json(response);
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
});

v1Router.get(Routes.commentsByTask, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const response = await getCommentsByTask(taskId);
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

v1Router.get(Routes.getCommentsByUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await getCommentsByUser(userId);
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

v1Router.get(Routes.getCommentsByContent, async (req, res) => {
    try {
        const content = req.params.content;
        const response = await getCommentsByUser(content);
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

v1Router.get(Routes.getCommentsByTaskAndUser, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const userId = req.params.userId;
        const response = await getCommentsByTask(taskId);
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

//label routes

v1Router.post(Routes.labels, async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await createLabel(req.body, userId);
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

v1Router.get(Routes.labels, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await getLabel(id);
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

//update
v1Router.put(Routes.labels, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateLabel(id, req.body);
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

v1Router.delete(Routes.labels, async (req, res) => {
    try {
        const id = req.query?.id as string | undefined;
        if (!id) {
            throw new Error("Label ID is required");
        }
        const response = await deleteLabel(id);
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

v1Router.get(Routes.labelList, async (req, res) => {
    try {
        const response = await getAllLabels();
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

v1Router.get(Routes.labelsByUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await getLabelsByUser(userId);
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

v1Router.get(Routes.labelsByColor, async (req, res) => {
    try {
        const color = req.params.color;
        const response = await getLabelsByColor(color);
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

v1Router.get(Routes.labelsByName, async (req, res) => {
    try {
        const name = req.params.name;
        const response = await getLabelsByName(name);
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

//activity routes

v1Router.post(Routes.activities, async (req, res) => {
    try {
        const userId = req.body.userId;
        const response = await createActivity(req.body, userId);
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

v1Router.delete(Routes.activities, async(req,res) =>{
    try {
        const id = req.query?.id as string | undefined;
        if(!id){
            throw new Error("Activity ID is required");
        }
        const response = await deleteActivity(id);
        res.status(response.status)
        
    } catch (err: unknown) {
        const error = err as Error;
        res.status(500).send({
            status: "error",
            message: error.message,
        });
    }
})

v1Router.get(Routes.activities, async (req, res) => {
    try {
        const response = await getAllActivities();
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

//update activity
v1Router.put(Routes.activities, async (req, res) => {
    try {
        const id = req.query.id as string;
        const response = await updateActivity(id, req.body);
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

v1Router.get(Routes.activityList, async (req, res) => {
    try {
        const response = await getAllActivities();
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

v1Router.get(Routes.activitiesByTask, async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const response = await getCommentsByTask(taskId);
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

v1Router.get(Routes.activitiesByUser, async (req, res) => {
    try {
        const userId = req.params.userId;
        const response = await getActivitiesByUser(userId);
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

v1Router.get(Routes.activitiesByAction, async (req, res) => {
    try {
        const action = req.params.action;
        const response = await getActivitiesByAction(action);
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

v1Router.get(Routes.activitiesByDetails, async (req, res) => {
    try {
        const details = req.params.details;
        const response = await getActivitiesByDetails(details);
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

v1Router.get(Routes.activitiesByTask,async(req,res) =>{
    try {
        const task = req.params.task;
        const response = await getActivitiesByTask(task);
        res.status(response.status).json(response);
    } catch (err : unknown) {
        const error = err as Error;
        res.status(500).send({
            status:"error",
            message: error.message
        });
        
    }
})





export default v1Router;