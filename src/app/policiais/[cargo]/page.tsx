"use client"

import {useEffect, useState} from "react";
import Header from "@/components/Header/Header";
import Menu from "@/components/Menu/Menu";

import styles from "./style.module.css"
import {toast} from "react-toastify";
import {client} from "@/api/axios";
import {useUserContext} from "@/app/Context/context";

export default function PolicesByRole({ params }) {

  const menuState = useState("hidden");
  const { userData, clearContext } = useUserContext();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    client
      .get("/users/byRole/" + params.cargo, {
        headers: { Authorization: userData?.access_token }
      })
      .then((response) => setUsers(response.data))
      .catch(() => {
        toast.error(
          "Opa! Você precisa estar logado para acessar essa página."
        );
        clearContext();
      });
  }, []);
  
  return (
    <main className={styles.policeListage + " min-h-screen min-w-screen"}>
      <Header menuState={menuState}/>
      <Menu menuState={menuState}/>
      <section className={styles.listage}>
        <h1>Controle de Policiais Ativos ®</h1>
        <div className={"flex ml-32 w-[100%] mt-8"}>
          <div className={""}>
            <h2>{decodeURIComponent(params.cargo)} - {users.length} policiais cadastrados.</h2>
            {users.map(user => <a key={user.nick} target={"_blank"} href={"/profile?nick=" + user.nick}>{user.nick}</a>)}
          </div>
        </div>
      </section>
    </main>
  )
}