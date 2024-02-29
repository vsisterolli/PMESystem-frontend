"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { router } from "next/client";
import { useRouter } from "next/navigation";

const UserContext = createContext({
    userData: {
        nick: "",
        role: {
            name: ""
        },
        permissionsObtained: [],
        userDepartamentRole: [],
        access_token: ""
    },
    setUserData: (value) => null,
    clearContext: () => null
});

export const UserContextProvider = ({ children }) => {
    const router = useRouter();

    let defaultData = {
        nick: "",
        role: {
            name: ""
        },
        permissionsObtained: [],
        departamentRoles: [],
        access_token: ""
    };

    if (typeof window !== "undefined") {
        const localData = localStorage.getItem("userData");
        if (localData) defaultData = JSON.parse(localData);
    }

    const [userData, setData] = useState(defaultData);

    const setUserData = (data) => {
        setData(data);
        if (typeof window !== "undefined")
            localStorage.setItem("userData", JSON.stringify(data));
    };

    const clearContext = () => {
        setData(defaultData);
        if (typeof window !== "undefined")
            localStorage.setItem("userData", JSON.stringify(defaultData));
        router.replace("/login?redirected=true");
    };

    // @ts-ignore
    return (
        <UserContext.Provider value={{ userData, setUserData, clearContext }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => useContext(UserContext);
