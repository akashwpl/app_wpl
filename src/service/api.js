import { axiosInstance } from '../lib/axiosInstance'

const handleForbiddenError = async (error) => {
    if (error?.request?.status === 403) {
        console.error('error', error)
        return
    }
    if (error?.request?.status === 401) {
        window.location.href = '/onboarding/funds'
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