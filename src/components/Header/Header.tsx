"use client"

import styles from "./header.module.css";
import {Alata, Alatsi, League_Gothic, Poppins} from "next/font/google";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });
const leagueGothic = League_Gothic({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "700" });
const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Header({ menuState }) {
  const [menu, setMenu] = menuState;
  return (<>
    <div className={styles.ghost}/>
    <header className={"fixed w-screen bg-sky-500/0 flex md:justify-center items-center " + styles.hd}>
      <div>
        <h1 className={styles.titleMain + " " + leagueGothic.className}>SYSTEM</h1>
        <h1 className={styles.titleSub + " " + alatsi.className}>PME</h1>
      </div>
      <div className={"flex " + styles.searchInput}>
        <ion-icon name="search"></ion-icon>
        <input placeholder={"Buscar militar"} className={styles.findUser + " " + alata.className}/>
      </div>
      <div className={styles.menuIcon}>
        <ion-icon onClick={() => setMenu(menu === "hidden" ? "flex":"hidden")} name="menu"></ion-icon>
      </div>
    </header>
    </>
  )
}