import { FC, JSX, ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAtomValue } from "jotai";
import { userAtom } from "@/store";

function AuthGuard({children}: {children: ReactNode}){
    const user = useAtomValue(userAtom)
    const location = useLocation()
    if(!user){
        return <Navigate to="/login" state={{from: location}} replace/>
    }

    return <>{children}</>
}

export function wrapWithGuard(Component: FC, isProtected?: boolean): JSX.Element {
    return isProtected ? <AuthGuard>
        <Component />
    </AuthGuard>   
    :
    <Component/> 
}