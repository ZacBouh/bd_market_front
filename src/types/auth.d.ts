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
