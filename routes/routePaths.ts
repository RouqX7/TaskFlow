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
    projectList: '/projects/list',
    //project team routes
    addTeamMember: '/projects/:projectId/team/add',
    removeTeamMember: '/projects/:projectId/team/remove'
}