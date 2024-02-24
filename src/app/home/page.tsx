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
import { Alatsi } from "next/font/google";
import Image from "next/image";
import Tippy from "@tippyjs/react";
import { client } from "@/api/axios";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });

export default function Home() {

  const menuState = useState("hidden");
  const pictures = [
    "https://s3-alpha-sig.figma.com/img/fd60/d3d0/c5f2fa9f764caa71e8c8bfc395283efc?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ontx~vuD61te10EzzMlBDOj-QahRAFde25IJv3NJIIWukxDXsVAG8~xIUxNwuRv3sIFaC7~9bvfGTaK7L~~o6IhDVqzHnY5pIr0Pi4wEiKr~G-Cj3r4zk0zg0iKIbmeliT4WH12V0Vgo~-bRw6wq2tNhcJhFX0uZdjsXsMFI~SJr68z6iQrirP4Oul2cgVBCaC~Wa5SxyugenKACWqkcY6N2V1zigRc6shK-qt0f7S7KgZr7DTh39jTxRzsrgTI54KNxoW95L7xW-vtJZcPPeOTDT0bmROY8NJ86EdbqydAX-ro1LPd9CGJUT8jNya85ZFSKdW4oUFS3eLsInu1o1A__",
    "https://s3-alpha-sig.figma.com/img/fd60/d3d0/c5f2fa9f764caa71e8c8bfc395283efc?Expires=1708905600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ontx~vuD61te10EzzMlBDOj-QahRAFde25IJv3NJIIWukxDXsVAG8~xIUxNwuRv3sIFaC7~9bvfGTaK7L~~o6IhDVqzHnY5pIr0Pi4wEiKr~G-Cj3r4zk0zg0iKIbmeliT4WH12V0Vgo~-bRw6wq2tNhcJhFX0uZdjsXsMFI~SJr68z6iQrirP4Oul2cgVBCaC~Wa5SxyugenKACWqkcY6N2V1zigRc6shK-qt0f7S7KgZr7DTh39jTxRzsrgTI54KNxoW95L7xW-vtJZcPPeOTDT0bmROY8NJ86EdbqydAX-ro1LPd9CGJUT8jNya85ZFSKdW4oUFS3eLsInu1o1A__"
  ]
  const [recentUsers, setRecentUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userToken = JSON.parse(localStorage.getItem("userData"))?.access_token;
    client.get("/users/recent", {headers: {Authorization: userToken}})
      .then(response => setRecentUsers(response.data))
      .catch(() => {
        router.replace("/login")
      })
  }, []);

  return (
    <main className={"min-h-screen min-w-screen " + styles.home}>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <Swiper autoplay={{
        delay: 6000,
        disableOnInteraction: false,
      }}  pagination={true} navigation={true} modules={[Navigation, Pagination, Autoplay]} className={styles.swiper}>
        {pictures.map((pictureURL, index) =>
          <SwiperSlide key={index}>
            <img src={pictureURL} alt={"Slide"}/>
          </SwiperSlide>
        )}
      </Swiper>
      <h3 className={alatsi.className + " " + styles.sectionTitle}>NOVOS MILITARES</h3>
      <div className={styles.newMilitary}>
        {recentUsers.map(user =>
        <Tippy content={user.nick} placement="bottom">
          <div className={styles.newPolice}>
            <Image width={150} height={222}
                   src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${user.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                   alt={"Seu habbo avatar"}/>
          </div>
        </Tippy>
        )}
      </div>
    </main>
  )
}