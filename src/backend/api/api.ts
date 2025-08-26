import axios from "axios"
import { store, userAtom } from "@/store"
import { logout } from "@/hooks/useUser"
import { routerNavigate } from "@/utils/routerNavigate"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL : `${API_BASE_URL}/api`,
    headers: {
        'Authorization': `Bearer ${() => store.get(userAtom)?.token}`
    }
})

api.interceptors.request.use(config => {
    const jwt = store.get(userAtom)?.token
    config.headers['Authorization'] = `Bearer ${jwt}`
    return config
})

api.interceptors.response.use(
    response => response, 
    error => {
        if (error.response?.status === 401){
            console.warn("Unauthorized !Redirect to login page")
            const intendedPath =  window.location.pathname + window.location.search
            sessionStorage.setItem('redirectAfterLogin', intendedPath)
            routerNavigate.setIntendedTo(intendedPath)
            logout()
            routerNavigate.navigate('/login')
        }
        // console.log("Interceptor Error log : ", error)
        return Promise.reject(error)
    }
)

export { api, API_BASE_URL }