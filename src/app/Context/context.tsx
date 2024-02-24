"use client"

import {createContext, useContext, useEffect, useState} from "react";

const UserContext = createContext({
  userData: {
    nick: "",
    role: {
      "name": ""
    },
    permissionsObtained: [],
    access_token: ""
  },
  setUserData: (value) => null
})

export const UserContextProvider = ({ children }) => {

  let defaultData = {
    nick: "",
    role: {
      "name": ""
    },
    permissionsObtained: [],
    access_token: ""
  }

  if(typeof window !== "undefined") {
    const localData = localStorage.getItem("userData");
    if (localData)
      defaultData = JSON.parse(localData);
  }

  const [userData, setData] = useState(defaultData);

  const setUserData = (data) => {
    setData(data);
    if(typeof window !== "undefined")
      localStorage.setItem("userData", JSON.stringify(data));
  }


  // @ts-ignore
  return (
    <UserContext.Provider value={{userData, setUserData}}>
      {children}
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext);