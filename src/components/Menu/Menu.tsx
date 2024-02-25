"use client"

import styles from "./style.module.css"
import Image from "next/image";
import {Alata} from "next/font/google";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {FaChevronLeft, FaHandshake} from "react-icons/fa";
import {IoIosArrowDown, IoIosArrowUp, IoIosHome, IoMdCheckmarkCircleOutline} from "react-icons/io";
import {MdOutlineDocumentScanner} from "react-icons/md";
import {LuClipboardList} from "react-icons/lu";
import {PiFunctionFill} from "react-icons/pi";
import {CiLogout} from "react-icons/ci";
import {useUserContext} from "@/app/Context/context";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Menu({ menuState }) {

  const {userData, setUserData} = useUserContext();
  const [visibility, setVisibility] = menuState;
  const [docDropdownVisibility, setDocDropdownVisibility] = useState("hidden");
  const router = useRouter();


  function handleLogout() {
      setUserData({...userData, nick: ""});
      router.replace("/login")
  }

  useEffect(() => {
    console.log(userData)
    if (userData.nick === "") {
      router.replace("/login");
    }
  }, []);

  return (
    <aside
      className={"flex flex-col min-h-screen overflow-y-auto overflow-x-clip w-full w-screen md:w-[350px] fixed " + visibility + " " + styles.menu}>
      <div className={styles.portrait}>
        <Image width={150} height={222}
               src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${userData.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
               alt={"Seu habbo avatar"}/>
      </div>
      <div className={styles.closeArrow} onClick={() => setVisibility("hidden")}>
        <FaChevronLeft />
        <div></div>
      </div>
      <h3 className={alata.className + " text-center mt-4"}>{userData.nick}</h3>
      <h4 className={alata.className + " text-center"}>{userData.role.name}</h4>
      <div className={styles.options + " md:ml-[46px] " + alata.className}>
        <a href="/home">
          <div className={styles.option}>
            <IoIosHome/>
            <button>Home</button>
          </div>
        </a>
        <div onClick={() => setDocDropdownVisibility(docDropdownVisibility === "hidden" ? "block" : "hidden")}
             className={styles.option}>
          <MdOutlineDocumentScanner/>
          <button>Documentos</button>
          <IoIosArrowDown
            className={(docDropdownVisibility === "hidden" ? "block" : "hidden") + " " + styles.arrowDown}/>
          <IoIosArrowUp className={docDropdownVisibility + " " + styles.arrowDown}/>
        </div>
        <div className={`pl-4 ${docDropdownVisibility} ` + styles.dropdown}>
          <button className="block" onClick={() => router.replace("/document/estatuto")}>Estatuto Oficial</button>
          <button className="block">Regimento Disciplinar</button>
        </div>
        <div className={styles.option}>
          <PiFunctionFill/>
          <button>Funções</button>
        </div>
        <div className={styles.option} onClick={() => router.replace('/atividades')}>
          <IoMdCheckmarkCircleOutline/>
          <button>Atividades</button>
        </div>
        {(userData.role.name === "Supremo" || userData.role.name === "Conselheiro") && <div className={styles.option} onClick={() => router.replace('/contratar')}>
          <FaHandshake/>
          <button>Contratar</button>
        </div>}
        <div className={styles.option}>
          <LuClipboardList/>
          <button>Listagens</button>
        </div>
        <div onClick={handleLogout} className={styles.option}>
          <CiLogout/>
          <button>Logout</button>
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
          src={"https://pmesystem.s3.sa-east-1.amazonaws.com/emblema.png"}
          alt={"Emblema PME"}
        />
        <Image
          width={260}
          height={260}
          src={"https://pmesystem.s3.sa-east-1.amazonaws.com/pulse-ring.png"}
          alt={"Emblema pulso"}
        />
      </div>
    </aside>
  )
}