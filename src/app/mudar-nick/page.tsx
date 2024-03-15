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
import { FaHandshake, FaRegUserCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useUserContext } from "@/app/Context/context";
import {IoPersonAdd, IoPersonRemoveSharp} from "react-icons/io5";

let timer;
let submitTimer;

export default function Contract() {
    const { userData, clearContext } = useUserContext();
    const menuState = useState("hidden");
    const [imageNick, setImageNick] = useState(userData.nick);
    const [nick, setNick] = useState("");
    const [newNick, setNewNick] = useState("")
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        if (
            !userData ||
            (userData.role.name !== "Supremo" &&
                userData.role.name !== "Conselheiro")
        ) {
            toast.error("Opa! Não era pra você estar por aqui.");
            return router.replace("/home");
        }
        client
            .get("/auth/roles", {
                headers: { Authorization: userData?.access_token }
            })
            .then((response) => setRoles(response.data))
            .catch(() => {
                toast.error(
                    "Opa! Você precisa estar logado para acessar essa página."
                );
                clearContext();
            });
    }, []);

    function setImg(event) {
        if (event.target.value === "") setImageNick(userData.nick);
        else setImageNick(event.target.value);
    }

    const debounce = (event) => {
        setNick(event.target.value);
        clearTimeout(timer);
        timer = setTimeout(() => setImg(event), 1500);
    };

    async function sendActivity() {
        try {
            await client.put(
                "/users/nick",
                {
                    prevNick: nick,
                    newNick,
                },
                { headers: { Authorization: userData?.access_token } }
            );
            toast.success("Nick alterado com sucesso!");
            router.replace("/profile?nick=" + newNick);
        } catch (e) {
            catchErrorMessage(e);
            setLoading(false);
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
                <form onSubmit={debounceSubmit} className={styles.activityForm}>
                    <h2 className={poppins.className}>TROCAR NICK</h2>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoPersonRemoveSharp/>
                        <input
                          required
                          type="text"
                          placeholder="Nickname atual"
                          className={poppins.className}
                          value={nick}
                          onChange={debounce}
                        />
                    </div>
                    <div className={"relative w-[60%] flex justify-center mb-8"}>
                        <IoPersonAdd/>
                        <input
                          required
                          type="text"
                          placeholder="Nickname novo"
                          className={poppins.className}
                          value={newNick}
                          onChange={event => setNewNick(event.target.value)}
                        />
                    </div>
                    <button disabled={loading} style={{opacity: loading ? "70%" : "100%"}} type="submit"
                            className={styles.formButtons}>
                        PUBLICAR
                    </button>
                </form>
            </div>
        </main>
    );
}
