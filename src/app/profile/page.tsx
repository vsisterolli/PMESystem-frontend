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
import {BeatLoader} from "react-spinners";
import {Alata} from "next/font/google";
import NotFound from "@/app/profile/NotFound";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Profile() {
  const menuState = useState("hidden");
  const searchParams = useSearchParams();
  const nick = searchParams.get("nick");
  const capeSelected = useState(0);

  const [profile, setProfile] = useState({});
  const [visualization, setVisualization] = useState("loading");
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    client.get("/users/profile/" + nick, { headers: { Authorization: userData.access_token}})
      .then(response => {
        setProfile(response.data)
        setVisualization("found")
      })
      .catch((e) => {
        setOptions(e.response.data);
        setVisualization("notFound")
      })
  }, [nick, capeSelected]);

  const renderedComponent = {
    "loading":
      <div className={styles.loading} >
        <h3 className={alata.className}>Carregando o perfil...</h3>
        <BeatLoader color="#ffffff"/>
      </div>,
    "found": <>
      <Aside profile={profile}/>
      <Timeline capeSelected={capeSelected} profile={profile}/>
    </>,
    "notFound": <NotFound nick={nick} options={options}/>
  }

  return (
    <>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <main className={"flex flex-col items-center md:items-start md:flex-row  flex-center min-w-screen min-h-screen " + styles.profile}>
        {renderedComponent[visualization]}
      </main>
    </>
  )
}