import { useAtom } from "jotai";
import { userAtom } from "@/store";

export function useUser(){
    const [user, setUser] = useAtom<LoggedInUser|null>(userAtom)
    const logout = () => {
        setUser(null)
    }
    return {user, logout}
}