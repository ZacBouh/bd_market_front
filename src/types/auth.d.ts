type LoginCredentials = {
    email: string,
    password: string
}

type NewUser = LoginCredentials & {
    pseudo: string
}

type CreatedUser = Omit<NewUser, 'password'> & {
    id: number,
    createdAt: string,
    updatedAt: string,
    role: string[]
}

type LoggedInUser = {
    user : CreatedUser,
    token: string
}
