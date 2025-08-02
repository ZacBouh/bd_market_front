import axios from 'axios'
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

type LoginCredentials = {
    email: string,
    password: string
}

type NewUser = LoginCredentials & {
    pseudo: string
}

type CreatedUser = NewUser & {
    id: number,
    createdAt: string,
    updatedAt: string,
    role: string[]
}

type LoggedInUser = {
    user : CreatedUser,
    token: string
}

async function registerUser(payload : NewUser) : Promise<CreatedUser>{
    const response = await axios.post<CreatedUser>(`${apiBaseUrl}/auth/register`, payload)
    return response.data
}

async function loginUser(payload : LoginCredentials) : Promise<LoggedInUser> {
    const response = await axios.post<LoggedInUser>(`${apiBaseUrl}/api/login_check`, payload)
    return response.data
}

export { registerUser, loginUser }
export type {CreatedUser, NewUser, LoginCredentials}