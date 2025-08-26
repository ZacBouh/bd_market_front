import axios from 'axios'
import { store, userAtom } from '@/store'
import { oAuthAtom } from '@/store/auth'
import { routerNavigate } from '@/utils/routerNavigate'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
const GOOGLE_OAUTH_REDIRECT_URI = import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URI


async function registerUser(payload : NewUser) : Promise<CreatedUser>{
    const response = await axios.post<CreatedUser>(`${API_BASE_URL}/auth/register`, payload)
    return response.data
}

async function loginUser(payload : LoginCredentials) : Promise<LoggedInUser> {
    const response = await axios.post<LoggedInUser>(`${API_BASE_URL}/api/login_check`, payload)
    store.set(userAtom, response.data)
    const redirectAfterLogin = routerNavigate.getIntendedTo() 
    if(typeof redirectAfterLogin === 'string'){
        routerNavigate.navigate(redirectAfterLogin)
    }
    return response.data
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

export { registerUser, loginUser, getGoogleOAuthOpenIdUrl }