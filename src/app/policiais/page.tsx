"use client"

import {useEffect, useState} from "react";
import Header from "@/components/Header/Header";
import Menu from "@/components/Menu/Menu";

import styles from "./style.module.css"
import {toast} from "react-toastify";
import {client} from "@/api/axios";
import {useUserContext} from "@/app/Context/context";

export default function Polices() {

  const menuState = useState("hidden");
  const { userData, clearContext } = useUserContext();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
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

  console.log(roles)

  return (
    <main className={styles.policeListage + " min-h-screen min-w-screen"}>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <section className={styles.listage}>
        <h1>Controle de Policiais Ativos ®</h1>
        <div className={"flex justify-around w-[100%] mt-8"}>
          <div className={"w-[50%] border-solid border-r-2 border-t-2 border-white"}>
            <h2>Militares</h2>
            {roles.filter(role => role.hierarchyKind === "MILITARY").map(role => <a key={role.name} href={"/policiais/" + role.name}>{role.name}</a>)}
          </div>
          <div className={"w-[50%] border-t-2 border-solid border-white"}>
            <h2>Executivos</h2>
            {roles.filter(role => role.hierarchyKind === "EXECUTIVE").map(role => <a key={role.name} href={"/policiais/" + role.name}>{role.name}</a>)}
          </div>
        </div>
      </section>
    </main>
  )
}