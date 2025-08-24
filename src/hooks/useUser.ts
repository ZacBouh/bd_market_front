import { useAtom } from "jotai";
import { store, userAtom } from "@/store";

export function useUser(){
    const [user, setUser] = useAtom<LoggedInUser|null>(userAtom)
    const logout = () => {
        setUser(null)
    }
    return {user, logout}
}

export function logout(){
    store.set(userAtom, null)
}