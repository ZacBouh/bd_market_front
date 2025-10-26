type LoginCredentials = {
    email: string,
    password: string
}

type NewUser = LoginCredentials & {
    pseudo: string
}

import type { UserRole } from "./enums/UserRole";

type CreatedUser = Omit<NewUser, 'password'> & {
    id: number,
    createdAt: string,
    updatedAt: string,
    roles: UserRole[]
}

type LoggedInUser = {
    user : CreatedUser,
    token: string
}
