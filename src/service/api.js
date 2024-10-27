import { axiosInstance } from '../lib/axiosInstance'

const handleForbiddenError = async (error) => {
    if (error?.request?.status === 403) {
        console.error('error', error)
        return
    }
    if (error?.request?.status === 401) {
        window.location.href = '/onboarding'
        return
    }
    if (error?.request?.status === 402) {
        window.location.href = '/banned'
        return
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

export const getUserDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`)
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
        handleForbiddenError(error)
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

export const submitMilestone = async (id) => {
    try {
        const response = await axiosInstance.put(`/projects/milestone/submit/${id}`)
        return response.data.data
    } catch (error) {
        handleForbiddenError(error)
    }
}



