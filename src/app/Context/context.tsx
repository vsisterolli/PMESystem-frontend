"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

const UserContext = createContext({
    userData: {
        nick: "",
        role: {
            name: "",
            powerLevel: 0,
            hierarchyPosition: 0
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

    const setUserData = async (data) => {
        setData(data);
        if (typeof window !== "undefined")
            await new Promise(resolve => {
                localStorage.setItem("userData", JSON.stringify(data));
                resolve();
            });
    };

    const clearContext =  async () => {
        setData(defaultData);
        if (typeof window !== "undefined") {
            await new Promise(resolve => {
                localStorage.setItem("userData", JSON.stringify(defaultData));
                resolve();
            });
        }
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
