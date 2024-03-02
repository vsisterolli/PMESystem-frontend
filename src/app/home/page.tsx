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
import { Alatsi } from "next/font/google";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import { client } from "@/api/axios";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/Context/context";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });

export default function Home() {
    const menuState = useState("hidden");
    const pictures = [
        "https://pmesystem.s3.sa-east-1.amazonaws.com/anfC8FK.png",
    ];
    const [recentUsers, setRecentUsers] = useState([]);
    const router = useRouter();
    const { userData, clearContext } = useUserContext();

    useEffect(() => {
        client
            .get("/users/recent", {
                headers: { Authorization: userData.access_token }
            })
            .then((response) => setRecentUsers(response.data))
            .catch(() => {
                clearContext();
            });
    }, []);

    return (
        <main className={"min-h-screen min-w-screen " + styles.home}>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <Swiper
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false
                }}
                pagination={true}
                navigation={true}
                modules={[Navigation, Pagination, Autoplay]}
                className={styles.swiper}
            >
                {pictures.map((pictureURL, index) => (
                    <SwiperSlide key={index}>
                        <img key={pictureURL} src={pictureURL} alt={"Slide"} />
                    </SwiperSlide>
                ))}
            </Swiper>
            <h3 className={alatsi.className + " " + styles.sectionTitle}>
                NOVOS MILITARES
            </h3>
            <div className={styles.newMilitary}>
                {recentUsers.map((user) => (
                    <Tippy key={user.nick} content={user.nick} placement="bottom">
                        <div className={styles.newPolice}>
                            <Image
                                width={150}
                                height={222}
                                src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${user.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                                alt={"Seu habbo avatar"}
                            />
                        </div>
                    </Tippy>
                ))}
            </div>
        </main>
    );
}
