"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu/Menu";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "tippy.js/dist/tippy.css";
import "tippy.js/dist/tippy.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Alatsi, Bayon, Poppins } from "next/font/google";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import { catchErrorMessage, client } from "@/api/axios";
import { set } from "yaml/dist/schema/yaml-1.1/set";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
import { FaRegUserCircle } from "react-icons/fa";
import {IoIosCheckmarkCircle, IoMdCheckmarkCircleOutline} from "react-icons/io";
import { useUserContext } from "@/app/Context/context";
import {TbWriting} from "react-icons/tb";

let timer;
let submitTimer;

export default function Activities() {


    const menuState = useState("hidden");
    const [imageNick, setImageNick] = useState("");
    const [approvedHeight, setApprovedHeight] = useState(68);
    const [reason, setReason] = useState("")
    const [nicks, setNicks] = useState("");
    const [checkbox, setCheckbox] = useState(false);
    const [option, setOption] = useState("");
    const [loading, setLoading] = useState(false);
    const { userData } = useUserContext();

    const router = useRouter();
    useEffect(() => {
        setImg({ target: { value: userData.nick } });
        const rhRole = userData.userDepartamentRole.find(role => role.departamentRoles.departament === "RH")
        if(userData.role.name === "Conselheiro" || userData.role.name === "Supremo")
            return;
        if(!rhRole || rhRole.departamentRoles.powerLevel < 10) {
            router.replace("/home")
            toast.error("Acesso negado")
        }
    }, []);

    function setImg(event) {
        if (event.target.value === "") setImageNick(userData.nick);
        else setImageNick(event.target.value);
    }

    async function sendActivity() {
        if (option === "unselected") {
            toast.error("Selecione uma atividade.");
            return;
        }

        if (option === "REBAIXAR") {
            try {
                await client.post(
                    "/actions/demote/multiple",
                    { demotedNicks: nicks.split("\n"), description: reason },
                    { headers: { Authorization: userData?.access_token } }
                );
                toast.success("Rebaixamentos postados!");
                router.replace("/rh/rebaixamentos");
            } catch (error) {
                catchErrorMessage(error);
                setLoading(false);
            }
        }

        if (option === "DEMITIR") {
            try {
                await client.post(
                    "/actions/fire/multiple",
                    { firedNicks: nicks.split("\n"), description: reason },
                    { headers: { Authorization: userData?.access_token } }
                );
                toast.success("Demissões postadas!");
                router.replace("/rh/demissoes");
            } catch (error) {
                catchErrorMessage(error);
                setLoading(false)
            }
        }

        if (option === "ADVERTIR") {
            try {
                await client.post(
                    "/actions/warn/multiple",
                    { warnedNicks: nicks.split("\n"), description: reason },
                    { headers: { Authorization: userData?.access_token } }
                );
                toast.success("Advertências postadas!");
                router.replace("rh/advertencias");
            } catch (error) {
                catchErrorMessage(error);
                setLoading(false)
            }
        }
    }

    const debounceSubmit = (event) => {
        event.preventDefault()
        setLoading(true);
        clearTimeout(submitTimer);
        submitTimer = setTimeout(() => sendActivity(), 1000)
    }

    return (
        <main className={"min-h-screen min-w-screen " + styles.activities}>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <div className={"flex items-center justify-center flex-col"}>
                <div
                    className={
                        "flex flex-col items-center justify-center " +
                        styles.portrait
                    }
                >
                    <Image
                        width={150}
                        height={222}
                        src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${imageNick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                        alt={"Seu habbo avatar"}
                    />
                    <div
                        className={
                            styles.blackRectangle + " " + bayon.className
                        }
                    >
                        {imageNick}
                    </div>
                </div>
                <form onSubmit={(event) => debounceSubmit(event)} className={styles.activityForm}>
                    <h2 className={poppins.className}>ATIVIDADES EM MASSA</h2>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <textarea
                          rows={10}
                          style={{height: `${approvedHeight}px`}}
                          onInput={(event) =>
                            setApprovedHeight(event.target.scrollHeight)
                          }
                          placeholder="Nickname dos policiais. (pule 1 linha por nick)"
                          className={poppins.className}
                          maxLength={4000}
                          value={nicks}
                          onChange={(event) =>
                            setNicks(event.target.value)
                          }
                        />
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoMdCheckmarkCircleOutline/>
                        <select
                          required
                          className={poppins.className}
                          value={option}
                          onChange={(event) => setOption(event.target.value)}
                          defaultValue={"unselected"}
                        >
                            <option value={"unselected"}>
                                Selecione a atividade
                            </option>
                            <option>ADVERTIR</option>
                            <option>REBAIXAR</option>
                            <option>DEMITIR</option>
                        </select>
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <TbWriting />
                        <input
                          required
                          type="text"
                          placeholder="Motivo"
                          className={poppins.className}
                          value={reason}
                          onChange={(event) => setReason(event.target.value)}
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
                        <h4>
                            Confirmo ter verificado as condições para postar
                            essa atividade e estou ciente de possíveis punições
                            em caso de erros
                        </h4>
                    </div>
                    <button disabled={loading} type="submit" style={{opacity: loading ? "70%" : "100%"}}
                            className={styles.formButtons}>
                        PUBLICAR
                    </button>
                </form>
            </div>
        </main>
    );
}
