"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css"
import {useEffect, useState} from "react";
import Menu from "@/components/Menu/Menu";
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/tippy.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import {Alatsi, Bayon, Poppins} from "next/font/google";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import {catchErrorMessage, client} from "@/api/axios";
import {set} from "yaml/dist/schema/yaml-1.1/set";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" })
import { FaRegUserCircle } from "react-icons/fa";
import {IoMdCheckmarkCircleOutline} from "react-icons/io";


let timer;

export default function Activities() {

  let userData;
  if (typeof window !== 'undefined') {
    userData = JSON.parse(localStorage.getItem("userData"))
  }
  const menuState = useState("hidden");
  const [imageNick, setImageNick] = useState(userData?.userData?.nick)
  const [nick, setNick] = useState("")
  const [checkbox, setCheckbox] = useState(false)
  const [description, setDescription] = useState("")
  const [option, setOption] = useState("")

  const router = useRouter();

  function setImg(event) {
    if(event.target.value === "")
      setImageNick(userData?.userData?.nick)
    else
      setImageNick(event.target.value)
  }

  const debounce = (event) => {
    setNick(event.target.value)
    clearTimeout(timer);
    timer = setTimeout(() => setImg(event), 1500);
  };

  async function sendActivity(event) {
      event.preventDefault()
      if(option === "unselected") {
        toast.error("Selecione uma atividade.")
        return
      }


      if(option === "PROMOVER") {
        try {
          await client.post("/actions/promote", { promotedNick: nick, description}, { headers: {Authorization: userData?.access_token}})
          toast.success("Promoção postada!")
          router.replace("/profile?nick=" + nick);
        } catch(error) {
          catchErrorMessage(error);
        }
      }

      if(option === "REBAIXAR") {
        try {
          await client.post("/actions/demote", { demotedNick: nick, description}, { headers: {Authorization: userData?.access_token}})
          toast.success("Rebaixamento postado!")
          router.replace("/profile?nick=" + nick);
        } catch(error) {
          catchErrorMessage(error);
        }
      }

      if(option === "DEMITIR") {
        try {
          await client.post("/actions/fire", { firedNick: nick, description}, { headers: {Authorization: userData?.access_token}})
          toast.success("Demissão postada!")
          router.replace("/profile?nick=" + nick);
        } catch(error) {
          catchErrorMessage(error);
        }
      }

      if(option === "ADVERTIR") {
        try {
          await client.post("/actions/warn", { warnedNick: nick, description}, { headers: {Authorization: userData?.access_token}})
          toast.success("Advertência postada!")
          router.replace("/profile?nick=" + nick);
        } catch(error) {
          catchErrorMessage(error);
        }
      }
  }

  return (
    <main className={"min-h-screen min-w-screen " + styles.activities}>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <div className={"flex items-center justify-center flex-col"}>
        <div className={"flex flex-col items-center justify-center " + styles.portrait}>
          <Image width={150} height={222}
                 src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${imageNick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                 alt={"Seu habbo avatar"}/>
          <div className={styles.blackRectangle + " " + bayon.className}>
            {imageNick}
          </div>
        </div>
        <form onSubmit={sendActivity} className={styles.activityForm}>
          <h2 className={poppins.className}>POSTAR ATIVIDADE</h2>
          <div className={"relative w-[60%] flex justify-center"}>
            <FaRegUserCircle/>
            <input
              required
              type="text"
              placeholder="Nickname do policial"
              className={poppins.className}
              value={nick}
              onChange={debounce}
            />
          </div>
          <div className={"relative w-[60%] flex justify-center"}>
            <IoMdCheckmarkCircleOutline />
            <select
              required
              className={poppins.className}
              value={option}
              onChange={(event) => setOption(event.target.value)}
            >
              <option value={"unselected"} selected>Selecione a atividade</option>
              <option>PROMOVER</option>
              <option>ADVERTIR</option>
              <option>REBAIXAR</option>
              <option>DEMITIR</option>
            </select>
          </div>
          <div className={"relative w-[60%] flex justify-center"}>
            <textarea
              required
              placeholder="Motivo"
              className={poppins.className}
              maxLength={4000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className={styles.checkbox}>
            <input
              required
              type="checkbox"
              className={poppins.className}
              value={checkbox}
              onClick={(event) => setCheckbox(event.target.value)}
            />
            <h4>Confirmo ter verificado as condições para postar essa atividade e estou ciente de possíveis punições em
              caso de erros</h4>
          </div>
          <button type="submit" className={styles.formButtons}>PUBLICAR</button>
          </form>
      </div>
    </main>
  )
}