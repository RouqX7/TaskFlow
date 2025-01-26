import { getCommentsByUser } from "../services/comment/CommentService";

export const Routes = {
    health: '/health',
    login: '/login',
    register: '/register',
    logout: '/logout',
    user: '/user',
    tasks: '/tasks',
    taskList: '/tasks/list',
    tasksByUser: '/tasks/user/:userId',
    tasksByStatus: '/tasks/status/:status',
    tasksByAssignee: '/tasks/assignee/:assignee',
    // project routes
    projects: '/projects',
    getProjectsByUser: '/projects/user/:userId' ,
    projectList: '/projects/list',
    
    //project team routes
    addTeamMember: '/projects/:projectId/team/add',
    removeTeamMember: '/projects/:projectId/team/remove',

     //comment routes
    comment: '/comment',
    commentList: '/comment/list',
    commentsByTask: '/comment/task/:taskId',
    getCommentsByUser: '/comment/user/:userId',
    getCommentsByContent: '/comment/content/:content',
    getCommentsByTaskAndUser: '/comment/task/:taskId/user/:userId',
    
    
    
}