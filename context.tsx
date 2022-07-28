import React, { createContext, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { DecodedTokenType, UserType } from './types';

export const GlobalContext = createContext<{
    user: UserType | null
    setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}>({
    user: null,
    setUser: () => { },
});

function getInitialState() {
    if (typeof localStorage !== "undefined") {
        const token = localStorage.getItem("token"); 
        if (token) {
            const decodedToken: DecodedTokenType = jwtDecode(token);

            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                return null;
            };

            return {
                _id: decodedToken._id,
                token,
                email: decodedToken.email,
                cities: []
            }
        }
    };
    return null;
};

type ProviderProps = { children: React.ReactNode };
export const GlobalProvider = ({children}: ProviderProps) => {
    const [user, setUser] = useState<UserType | null>(getInitialState());

    return <GlobalContext.Provider value={{ user, setUser }}>
        {children}
    </GlobalContext.Provider>
};