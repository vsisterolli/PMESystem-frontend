import styles from "./styles.module.css";
import { Alata, Bayon } from "next/font/google";
import Image from "next/image";
import moment from "moment";
import { useUserContext } from "@/app/Context/context";
import { useState } from "react";
import { toast } from "react-toastify";
import { client } from "@/api/axios";
import { useRouter } from "next/navigation";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const alata = Alata({ subsets: ["latin"], weight: "400" });

let timer;

export default function Aside({ profile }) {
    const { userData } = useUserContext();
    const [discord, setDiscord] = useState(profile.discord);
    const router = useRouter();

    async function postDiscord(dc) {
        try {
            await client.patch(
                "/users/changeDiscord",
                { discord: dc },
                { headers: { Authorization: userData.access_token } }
            );
            toast.success("Discord alterado.");
            profile.discord = dc;
            router.refresh();
        } catch (e) {
            toast.error(
                "Algo deu errado ao atualizar o discord... Se o problema persistir, procure um administrador."
            );
        }
    }

    const debounce = (event) => {
        setDiscord(event.target.value);
        clearTimeout(timer);
        timer = setTimeout(() => postDiscord(event.target.value), 1500);
    };

    return (
        <aside className={"min-w-[400px] w-[30vw] flex flex-col items-center"}>
            <div
                className={
                    "flex items-center justify-center " + styles.portrait
                }
            >
                <Image
                    width={150}
                    height={222}
                    src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${profile.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                    alt={"Seu habbo avatar"}
                />
                <div className={styles.blackRectangle + " " + bayon.className}>
                    {profile.nick}
                </div>
            </div>
            {profile.nick === userData.nick && (
                <div
                    className={
                        "flex flex-col items-center mt-4 " +
                        styles.dcHolder +
                        " " +
                        alata.className
                    }
                >
                    Insira seu @ do discord
                    <input
                        value={discord}
                        onChange={(event) => debounce(event)}
                        className={"mt-4"}
                        placeholder={"Coloque o @, não o usuário!"}
                    />
                </div>
            )}
            {profile.discord && (
                <a
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
                    {profile.discord}
                </a>
            )}
            <div className={styles.status}>
                <div className={styles.sectionTitle + " " + bayon.className}>
                    STATUS
                </div>
                <div className={alata.className}>
                    <span>
                        Situação:{" "}
                        {profile.isAccountActive ? " ativo" : " inativo"}
                    </span>
                    <span>
                        Bonificações na patente: {profile.bonificationsInRole}
                    </span>
                    <span>
                        Bonificações totais: {profile.totalBonifications}
                    </span>
                    <span>Número de advertências: {profile.advNum}</span>
                    <span>
                        Data de criação:{" "}
                        {moment(profile.createdAt).format("DD/MM/yyyy")}
                    </span>
                    <span>
                        Última promoção:{" "}
                        {moment(profile.lastPromoted).format("DD/MM/yyyy")}
                    </span>
                </div>
            </div>
        </aside>
    );
}
