import { Types } from "mongoose"

export type UserType = {
    _id: Types.ObjectId
    token?: string
    email: string
    password: string
    cities: string[]
}

export type Response = {
    code: 0 | 1
    message: string
}

export type AuthResponse = Response & {
    _id: string
    token: string
}