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
  const documents = {
    "cd": {
      title: "Código Disciplinar - PME ®",
      src: "https://docs.google.com/document/d/e/2PACX-1vQy9pTk0-E8eXK9b1SG7_31gUpdIWn5xNPNMTXKC1UFXLCMqHcl6mWakgmY88XFK1u82WflQ6G52XCu/pub?embedded=true"
    },
    "estatuto": {
      title: "Estatuto - PME ®",
      src: "https://docs.google.com/document/d/e/2PACX-1vTLDOk0UC39qryN0KwhPoawzeWGuzUvtoL8oZ0-8JOozM2vJX0FkDmElOLz94Skwb5nKvKrZ66lwhPQ/pub?embedded=true"
    }
  }

  const {userData, clearContext} = useUserContext();

  const router = useRouter();
  useEffect(() => {
    client.get("/users/permissions", {headers: {Authorization: userData?.access_token}})
      .catch(() => {
        toast.error("Opa! Você precisa estar logado para acessar essa página.")
        clearContext();
      })
  }, []);

  return (
    <>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <div className={"flex flex-col items-center justify-center bg-[#261046] " + styles.document}>
        <h1 className={styles.docTitle + " " + alata.className}>{documents[params.name]?.title}</h1>
        <iframe className={"max-w-full w-[1050px] min-h-screen mt-16"}
                src={documents[params.name]?.src}/>
      </div>
    </>
      )
}