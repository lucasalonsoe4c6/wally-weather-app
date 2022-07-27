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

export type WeatherResponse = Response & {
    current: {
        last_updated_epoch: number,
        last_updated: string,
        temp_c: number,
        temp_f: number,
        is_day: number,
        condition: {
            text: string,
            icon: string,
            code: number
        },
        wind_mph: number,
        wind_kph: number,
        wind_degree: number,
        wind_dir: string,
        pressure_mb: number,
        pressure_in: number,
        precip_mm: number,
        precip_in: number,
        humidity: number,
        cloud: number,
        feelslike_c: number,
        feelslike_f: number,
        vis_km: number,
        vis_miles: number,
        uv: number,
        gust_mph: number,
        gust_kph: number
    },
    location: {
        name: string,
        region: string,
        country: string,
        lat: number,
        lon: number,
        tz_id: string,
        localtime_epoch: number,
        localtime: string
    }
}