import axios from "axios"
import { store, userAtom } from "@/store"

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
    baseURL : `${apiBaseUrl}/api`,
    headers: {
        'Authorization': `Bearer ${() => store.get(userAtom)?.token}`
    }
})

api.interceptors.request.use(config => {
    const jwt = store.get(userAtom)?.token
    config.headers['Authorization'] = `Bearer ${jwt}`
    return config
})

export { api }