"use client"

import Header from "@/components/Header/Header";
import styles from "./style.module.css"
import {Alata} from "next/font/google";
import {client} from "@/api/axios";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import Menu from "@/components/Menu/Menu";
import {useUserContext} from "@/app/Context/context";

const alata = Alata({subsets: ["latin"], weight: "400"})

export default function Document({ params }) {


  const menuState = useState("hidden");

  const {userData} = useUserContext();

  const router = useRouter();
  useEffect(() => {
    client.get("/users/permissions", {headers: {Authorization: userData?.access_token}})
      .catch(() => {
        toast.error("Opa! Você precisa estar logado para acessar essa página.")
        router.replace("/login")
      })

  }, []);

  return (
    <>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <div className={"flex flex-col items-center justify-center bg-[#261046] " + styles.document}>
        <h1 className={styles.docTitle + " " + alata.className}>Estatuto Oficial - Polícia PME ®</h1>
        <iframe className={"max-w-full w-[1050px] min-h-screen mt-16"}
                src="https://docs.google.com/document/d/e/2PACX-1vTLDOk0UC39qryN0KwhPoawzeWGuzUvtoL8oZ0-8JOozM2vJX0FkDmElOLz94Skwb5nKvKrZ66lwhPQ/pub?embedded=true"/>
      </div>
    </>
      )
}