import Loader from "@/error-handling/fallbacks/Loader"
import { useEffect } from "react"
import { routerNavigate } from "@/utils/routerNavigate"
import { useAtom } from "jotai"
import { userAtom } from "@/store"
import { getUser } from "@/backend/api/auth"

const OauthRedirect = () => {
    const [ _, setUser] = useAtom(userAtom)
    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.slice(1))
        const token = params.get('token')
        if(token){
            setUser({user: {
                id: 0, 
                email: 'placeholder',
                createdAt: 'placeholder',
                pseudo: 'placeholder',
                updatedAt: 'placeholder',
                role: ['placeholder']
            }, token: token})
            getUser(() => {
                routerNavigate.postLoginRedirect()
            })      
        } else {
            routerNavigate.navigate('/login')
        }
    },[])
    
    return <Loader/>
}

export default OauthRedirect