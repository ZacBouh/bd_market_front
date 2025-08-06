import axios from "axios"
import { store, userAtom } from "@/store"

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

export { api, API_BASE_URL }