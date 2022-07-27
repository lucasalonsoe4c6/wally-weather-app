import { Types } from "mongoose"

export type UserType = {
    _id: Types.ObjectId
    token: string
    email?: string
    password?: string
    cities: string[]
}

export type DecodedTokenProperties = {
    exp: number
}

export type DecodedTokenType = UserType & DecodedTokenProperties;

export type Response = {
    code: 0 | 1
    message: string
}

export type AuthResponse = Response & {
    _id: Types.ObjectId
    token: string
}