"use client";

import styles from "./styles.module.css";
import Header from "@/components/Header/Header";
import Menu from "@/components/Menu/Menu";
import {useEffect, useState} from "react";
import Aside from "@/app/profile/Aside";
import {useSearchParams} from "next/navigation";
import Timeline from "@/app/profile/Timeline";
import {client} from "@/api/axios";
import {toast} from "react-toastify";

export default function Profile() {
  const menuState = useState("hidden");
  const searchParams = useSearchParams();
  const nick = searchParams.get("nick");

  const [profile, setProfile] = useState({});
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    client.get("/users/profile/" + nick, { headers: { Authorization: userData.access_token}})
      .then(response => setProfile(response.data))
      .catch(() => toast.error("Usuário não encontrado."))
  }, [nick]);

  return (
    <>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <main className={"flex flex-col items-center md:items-start md:flex-row  flex-center min-w-screen min-h-screen " + styles.profile}>
        <Aside profile={profile}/>
        <Timeline profile={profile}/>
      </main>
    </>
  )
}