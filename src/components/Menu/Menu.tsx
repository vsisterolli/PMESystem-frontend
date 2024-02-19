"use client"

import styles from "./style.module.css"
import Image from "next/image";
import {Alata} from "next/font/google";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Menu({ menuState }) {

  const [userData, setUserData] = useState({
    nick: "",
    role: ""
  });
  const [visibility, setVisibility] = menuState;
  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if(!data || data === "undefined") {
      router.replace("/login")
    }
    else setUserData(JSON.parse(data));
  }, []);

  return (
    <aside className={"flex flex-col min-h-screen w-full w-screen md:w-[350px] fixed " + visibility + " " + styles.menu}>
      <div className={styles.portrait}>
        <Image width={150} height={222}
               src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${userData.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
               alt={"Seu habbo avatar"}/>
      </div>
      <div className={styles.closeArrow} onClick={() => setVisibility("hidden")}>
        <ion-icon name="arrow-dropleft"></ion-icon>
        <div></div>
      </div>
      <h3 className={alata.className + " text-center mt-4"}>{userData.nick}</h3>
      <h4 className={alata.className + " text-center"}>{userData.role.name}</h4>
      <div className={styles.options + " md:ml-[46px] " + alata.className}>
        <div>
          <ion-icon name="home"></ion-icon>
          <a>Home</a>
        </div>
        <div>
          <ion-icon name="paper"></ion-icon>
          <a>Documentos</a>
        </div>
        <div>
          <ion-icon name="checkbox-outline"></ion-icon>
          <a>Funções</a>
        </div>
        <div>
          <ion-icon name="arrow-dropup-circle"></ion-icon>
          <a>Atividades</a>
        </div>
        <div>
          <ion-icon name="list"></ion-icon>
          <a>Controle de patentes</a>
        </div>
      </div>
    </aside>
  )
}