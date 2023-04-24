export interface UserDetail {
    name: string,
    email: string,
    sub: string,
    token: string,
    picture: string,
}

export interface gDoc {
    iss: string
    azp: string
    aud: string
    sub: string
    email: string
    email_verified: boolean
    at_hash: string
    nonce: string
    name: string
    picture: string
    given_name: string
    family_name: string
    locale: string
    iat: number
    exp: number
    jti: string
}

export interface User{
    email: string
    password: string
    name: string
}

export interface ExpenseAccount{
    groupName: string
    email: string
}

export interface AuthPayload{
    email: string
}

export interface Transaction{
    email: string
    groupName: string
    description: string
    amount: number
    category: string
    date: Date
    transactionID: string
}