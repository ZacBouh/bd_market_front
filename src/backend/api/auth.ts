import axios from 'axios'
import { store, userAtom } from '@/store'
import { oAuthAtom } from '@/store/auth'
import { routerNavigate } from '@/utils/routerNavigate'
import { api } from './api'
import { notification } from '@/utils/padNotification'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
const GOOGLE_OAUTH_REDIRECT_URI = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI


async function registerUser(payload : NewUser, callback?: (user: CreatedUser) => unknown) {
    const controller = new AbortController()
    axios.post<CreatedUser>(`${API_BASE_URL}/auth/register`, payload, {signal: controller.signal})
    .then(response => {
        callback && callback(response.data)
    })
    .catch(error => {
        if(error?.response?.data?.message){
            notification.show(`Failed to register: ${error?.response?.data?.message}`, {
                severity: 'error',
                autoHideDuration: 4000
            })
            return
        }
        if(error instanceof Error){
            notification.show(`Failed to register: ${error.message}`, {
                severity: 'error',
                autoHideDuration: 2500
            })
        }
    } )
    return () => controller.abort()
}

function loginUser(payload : LoginCredentials, callback?: (user: LoggedInUser) => unknown) {
    const controller = new AbortController()
    axios.post<LoggedInUser>(`${API_BASE_URL}/api/login_check`, payload, {signal: controller.signal})
    .then(response => {
        store.set(userAtom, response.data)
        routerNavigate.postLoginRedirect()
        callback && callback(response.data)
    })
    .catch( error => {
        let notif : Parameters<typeof notification.show> = [`Failed to login`,{autoHideDuration: 2500, severity: 'error'}] 
        if(error?.response?.data?.message){
            notif[0] = `Failed to login: ${error?.response?.data?.message}`
        }
        if(error?.response?.status === 401) {
            notif[0] = `Invalid Credentials`
        }
        notification.show(...notif)
    })
    return () => controller.abort()
    
}

async function getGoogleOAuthOpenIdUrl(loginFromUrl?: string) : Promise<any>
{
    const response = await axios.get<any>(`https://accounts.google.com/.well-known/openid-configuration`)
    store.set(oAuthAtom, (prev: any) => ({...(prev ?? {}), google: response.data }) )
    const params = {
        client_id : GOOGLE_OAUTH_CLIENT_ID,
        scope : 'openid email',
        redirect_uri : GOOGLE_OAUTH_REDIRECT_URI,
        state : JSON.stringify({bd_project_token: crypto.randomUUID(), url: loginFromUrl ?? ''}),
        nonce : crypto.randomUUID(),
        response_type: 'code'
    }
    const queryString = new URLSearchParams(params)
    return `${response.data.authorization_endpoint}?${queryString}`
}

const getUser = (callback? : (user: LoggedInUser) => unknown) => {
    const controller = new AbortController()
    api.get<CreatedUser>('/user')
    .then(response =>{
        const token = store.get(userAtom)?.token
        if(!token){
            throw new Error("Logic error, token not defined in getUser callback at auth.ts line 48")
        }
        store.set(userAtom, {token, user: response.data}) 
        callback && callback({token, user: response.data})
    })
    return () => controller.abort()
} 

export { registerUser, loginUser, getGoogleOAuthOpenIdUrl, getUser}