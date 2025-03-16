import { axiosInstance } from '../lib/axiosInstance'

const token = localStorage.getItem('token_app_wpl')

const handleForbiddenError = async (error) => {
    if (error?.request?.status === 403) {
        console.error('error', error)
        return
    }
    if (error?.request?.status === 401 && token) {
        window.alert('Your session has expired. Please login again')
        window.location.href = '/onboarding'
        return
    }
    if (error?.request?.status === 402) {
        window.location.href = '/banned'
        return
    }
    if (error?.status === 400) {
        console.error('error', error);
        return { err: error?.response?.data?.message }
    }
    if (error?.status === 409) {
        console.error('error', error);
        return { err: error?.response?.data?.message }
    }
};

export const getProjectDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/projects/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getAllProjects = async () => {
    try {
        const response = await axiosInstance.get('/projects')
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getAllUers = async () => {
    try {
        const response = await axiosInstance.get('/users')
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getUserDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}


export const getOrgProjects = async (id) => {
    try {
        const response = await axiosInstance.get(`/organisation/${id}/projects`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getUserProjects = async () => {
    try {
        const response = await axiosInstance.get('/projects/user')
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getAllOrganisations = async () => {
    try {
        const response = await axiosInstance.get('/organisation')
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const updateProjectDetails = async (id, updData) => {
    try {
        const response = await axiosInstance.put(`/projects/updateWithMilestone/${id}`, updData)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const deleteProject = async (id) => {
    try {
        const response = await axiosInstance.delete(`/projects/delete/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const applyForProject = async (id, data) => {
    try {
        const response = await axiosInstance.post(`/submissions/submit/${id}`, data)
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const getProjectSubmissions = async (id) => {
    try {
        const response = await axiosInstance.get(`/submissions/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const acceptRejectSubmission = async (submissionData, id) => {
    try {
        const response = await axiosInstance.put(`/submissions/update/${id}`, submissionData)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const submitMilestone = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/projects/milestone/submit/${id}`, data)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const updateMilestone = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/projects/milestone/update/${id}`, data)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const createOrganisation = async (data) => {
    try {
        const response = await axiosInstance.post('/organisation/create', data)
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const getUserOrgs = async (id) => {
    try {
        const response = await axiosInstance.get(`organisation/user/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getOrgById = async (id) => {
    try {
        const response = await axiosInstance.get(`organisation/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getAllOrgs = async () => {
    try {
        const response = await axiosInstance.get(`organisation`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

// Not needed as per new flow
// export const approveOrgByAdmin = async (id, data) => {
//     try {
//         const response = await axiosInstance.post(`organisation/updateStatus/${id}`, data)
//         return response.data.data
//     } catch (error) {
//         handleForbiddenError(error)
//     }
// }

export const getLeaderboardData = async () => {
    try {
        const response = await axiosInstance.get(`/leaderboard`)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getNotifications = async () => {
    try {
        const response = await axiosInstance.get(`/notifications/fetchByUserId`)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const createNotification = async (data) => {
    try {
        const response = await axiosInstance.post(`/notifications/addNotification`, data)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const updNotification = async (id, data) => {
    try {
        const response = await axiosInstance.put(`/notifications/updateNotification/${id}`, data)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getAdmins = async () => {
    try {
        const response = await axiosInstance.get('/users/admins')
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const createOpenProject = async (data) => {
    try {
        const response = await axiosInstance.post('/openProjects/create/', data)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const createProject = async (data) => {
    try {
        const response = await axiosInstance.post('/projects/create/', data)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const updateOpenProjectDetails = async (id, updData) => {
    try {
        const response = await axiosInstance.put(`/openProjects/update/${id}`, updData)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const submitOpenMilestone = async (milestone_id, body) => {
    try {
        const response = await axiosInstance.post(`/openProjects/milestone/submit/${milestone_id}`, body)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const submitOpenProject = async (project_id, body) => {
    try {
        const response = await axiosInstance.post(`/openProjects/project/submit/${project_id}`, body)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

// new Submissions route for open bounties
export const getOpenProjectSubmissions = async (project_id) => {
    try {
        const response = await axiosInstance.get(`/openSubmissions/project/${project_id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getOpenMilestoneSubmissions = async (milestone_id) => {
    try {
        const response = await axiosInstance.get(`/openSubmissions/${milestone_id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const acceptOpenProjectSubmissions = async (project_id, data) => {
    try {
        const response = await axiosInstance.post(`/openSubmissions/accept/${project_id}`, data)
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const getPendingProjects = async () => {
    try {
        const response = await axiosInstance.get(`/projects/pending`);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const adminProjectApproveOrReject = async (id,data) => {
    try {
        const response = await axiosInstance.put(`/projects/approveOrReject/${id}`, data);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const adminOpenProjectApproveOrReject = async (id,data) => {
    try {
        const response = await axiosInstance.put(`/openProjects/approveOrReject/${id}`, data);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const verifyOtp = async (data) => {
    try {
        const response = await axiosInstance.post(`/account/verifyOtp`, data);
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const createUser = async (data) => {
    try {
        const response = await axiosInstance.post(`/users/signup`, data);
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const createGrant = async (data) => {
    try {
        const response = await axiosInstance.post(`/grants/create`, data);
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const getAllGrants = async () => {
    try {
        const response = await axiosInstance.get(`/grants`);
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const getGrantById = async (id) => {
    try {
        const response = await axiosInstance.get(`/grants/${id}`);
        return response.data.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}

export const grantApproveOrRejectById = async (id,data) => {
    try {
        const response = await axiosInstance.put(`/grants/approveOrReject/${id}`, data);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const closeGrantById = async (id) => {
    try {
        const response = await axiosInstance.post(`/grants/close/${id}`);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const editGrantById = async (id,data) => {
    try {
        const response = await axiosInstance.put(`/grants/update/${id}`, data);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const updateCopperXPatToken = async (body) => {
    try {
        const response = await axiosInstance.put(`/users/update/pat`, body);
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const sendOpenProjectRewards = async (project_id) => {
    try {
        const response = await axiosInstance.post(`/openProjects/project/pay/${project_id}`);
        return response.data
    } catch (error) {
        handleForbiddenError(error)
    }
}

export const sendProjectMilestoneReward = async (milestone_id, data) => {
    try {
        const response = await axiosInstance.post(`/projects/project/pay/milestone/${milestone_id}`, data);
        return response.data
    } catch (error) {
        return handleForbiddenError(error)
    }
}