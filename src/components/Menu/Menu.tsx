"use client"

import styles from "./style.module.css"
import Image from "next/image";
import {Alata} from "next/font/google";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Menu({ menuState }) {

  const [userData, setUserData] = useState({
    userData: {
      "nick": "",
      role: {
        "name": ""
      }
    }
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
    <aside
      className={"flex flex-col min-h-screen w-full w-screen md:w-[350px] fixed " + visibility + " " + styles.menu}>
      <div className={styles.portrait}>
        <Image width={150} height={222}
               src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${userData.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
               alt={"Seu habbo avatar"}/>
      </div>
      <div className={styles.closeArrow} onClick={() => setVisibility("hidden")}>
        <ion-icon name="ios-arrow-dropleft"></ion-icon>
        <div></div>
      </div>
      <h3 className={alata.className + " text-center mt-4"}>{userData.userData.nick}</h3>
      <h4 className={alata.className + " text-center"}>{userData.userData.role?.name}</h4>
      <div className={styles.options + " md:ml-[46px] " + alata.className}>
        <a href="/home">
          <div>
            <ion-icon name="home"></ion-icon>
            <button>Home</button>
          </div>
        </a>
        <div>
          <ion-icon name="paper"></ion-icon>
          <button>Documentos</button>
        </div>
        <div>
          <ion-icon name="checkbox-outline"></ion-icon>
          <button>Funções</button>
        </div>
        <div onClick={() => router.replace('/atividades')}>
          <ion-icon name="arrow-dropup-circle"></ion-icon>
          <button>Atividades</button>
        </div>
        <div>
          <ion-icon name="list"></ion-icon>
          <button>Controle de patentes</button>
        </div>
      </div>
      <div
        className={
          styles.emblema + " "
        }
      >
        <Image
          className={"z-10"}
          width={160}
          height={160}
          src={"/emblema.png"}
          alt={"Emblema PME"}
        />
        <Image
          width={260}
          height={260}
          src={"/pulse-ring.png"}
          alt={"Emblema pulso"}
        />
      </div>
    </aside>
  )
}