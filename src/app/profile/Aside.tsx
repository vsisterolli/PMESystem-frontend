import styles from "./styles.module.css";
import {Alata, Bayon} from "next/font/google";
import Image from "next/image";
import moment from "moment";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const alata = Alata({ subsets: ["latin"], weight: "400" });


export default function Aside({ profile }) {
  return (
    <aside className={"min-w-[400px] w-[30vw] flex flex-col items-center"}>
      <div className={"flex items-center justify-center " + styles.portrait}>
        <Image width={150} height={222}
               src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${profile.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
               alt={"Seu habbo avatar"}/>
        <div className={styles.blackRectangle + " " + bayon.className}>
          {profile.nick}
        </div>
      </div>
      <a
        href="https://discord.gg/rDvqyYwU4F"
        target="_blank"
        className={
          "flex items-center justify-center " +
          styles.discordHolder
        }
      >
        <Image
          className={"mr-4"}
          height={32}
          width={32}
          src={"/dc-icon.png"}
          alt={"Icon discord"}
        />
        Discord
      </a>
      <div className={styles.status}>
        <div className={styles.sectionTitle + " " + bayon.className}>
          STATUS
        </div>
        <div className={alata.className}>

          <span>Situação: {profile.isAccountActive ? " ativo" : " inativo"}</span>
          <span>Número de advertências: {profile.advNum}</span>
          <span>Data de criação: {moment(profile.createdAt).format("DD/MM/yyyy")}</span>
          <span>Última promoção: {moment(profile.lastPromoted).format("DD/MM/yyyy")}</span>
        </div>
      </div>
    </aside>
  )
}