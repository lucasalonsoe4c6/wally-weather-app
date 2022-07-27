import { Types } from "mongoose"

export type UserType = {
    _id: Types.ObjectId
    token?: string
    email: string
    password: string
    cities: string[]
}