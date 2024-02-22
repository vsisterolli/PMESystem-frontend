"use client"

import styles from "./header.module.css";
import {Alata, Alatsi, League_Gothic, Poppins} from "next/font/google";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {IoIosMenu, IoIosSearch} from "react-icons/io";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });
const leagueGothic = League_Gothic({ subsets: ["latin"] });
const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Header({ menuState }) {
  const [menu, setMenu] = menuState;
  const [search, setSearch] = useState("")
  const router = useRouter();

  function searchUser(event) {
    event.preventDefault()
    router.replace("/profile?nick=" + search)
  }

  return (<>
    <div className={styles.ghost}/>
    <header className={"fixed w-screen bg-sky-500/0 flex md:justify-center items-center " + styles.hd}>
      <div>
        <a href="/home">
          <h1 className={styles.titleMain + " " + leagueGothic.className}>SYSTEM</h1>
          <h1 className={styles.titleSub + " " + alatsi.className}>PME</h1>
        </a>
      </div>
      <form onSubmit={searchUser}>
        <div className={"flex " + styles.searchInput}>
          <IoIosSearch/>
          <input required value={search} onChange={event => setSearch(event.target.value)} placeholder={"Buscar militar"} className={styles.findUser + " " + alata.className}/>
        </div>
      </form>
      <div className={styles.menuIcon}>
        <IoIosMenu onClick={() => setMenu(menu === "hidden" ? "flex":"hidden")}/>
      </div>
    </header>
    </>
  )
}