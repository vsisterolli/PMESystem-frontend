"use client";

import styles from "./style.module.css";
import { useUserContext } from "@/app/Context/context";
import Image from "next/image";
import { Alatsi, League_Gothic, Poppins } from "next/font/google";
import {Suspense, useEffect, useState} from "react";
import { client, catchErrorMessage } from "@/api/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });
const leagueGothic = League_Gothic({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "700" });
import { useSearchParams } from 'next/navigation'
import {IoPersonSharp} from "react-icons/io5";
import {FaLock} from "react-icons/fa";

const HoldRedirect = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const {userData, clearContext} = useUserContext();

    useEffect(() => {
        if(searchParams.get("redirected") !== "true" && userData?.nick !== "")
            router.replace("/home")
        else clearContext()
    }, []);
    return <p></p>
}

export default function LoginPage() {
    const { userData, setUserData } = useUserContext();
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();


    async function sendLogin(event) {
        event.preventDefault();
        try {
            const response = await client.post("/auth/login", {
                nick,
                password
            });
            toast.success("Login feito com sucesso.");
            setUserData(response.data);
            router.replace("/home");
        } catch (e) {
            catchErrorMessage(e);
        }
    }

    return (
        <main className="flex min-h-screen min-w-screen">
            <Suspense><HoldRedirect/></Suspense>
            <div
                className={`flex-col items-center justify-center min-h-screen hidden xl:flex w-[55%] ${styles.decorativebg}`}
            >
                <div
                    className={"absolute min-h-full w-full " + styles.bgeffect}
                />
                <div className={styles.emblema + " " + styles.pulsate}>
                    <Image
                        className={"z-10"}
                        width={460}
                        height={460}
                        src={
                            "https://pmesystem.s3.sa-east-1.amazonaws.com/emblema.png"
                        }
                        alt={"Emblema PME"}
                    />
                    <Image
                        width={560}
                        height={560}
                        src={
                            "https://pmesystem.s3.sa-east-1.amazonaws.com/pulse-ring.png"
                        }
                        alt={"Emblema pulso"}
                    />
                </div>
                <div>
                    <h1 className={styles.title + " " + leagueGothic.className}>
                        SYSTEM
                    </h1>
                    <h1 className={styles.subtitle + " " + alatsi.className}>
                        PME
                    </h1>
                </div>
            </div>
            <aside
                className={`flex flex-col justify-center items-center min-h-screen w-[100%] xl:w-[45%] ${styles.loginForm}`}
            >
                <h2 className={poppins.className + " " + styles.pageTitle}>
                    LOGIN
                </h2>
                <div
                    className={
                        styles.emblemaMobile + " xl:hidden " + styles.pulsate
                    }
                >
                    <Image
                        className={"z-10"}
                        width={160}
                        height={160}
                        src={
                            "https://pmesystem.s3.sa-east-1.amazonaws.com/emblema.png"
                        }
                        alt={"Emblema PME"}
                    />
                    <Image
                        width={260}
                        height={260}
                        src={
                            "https://pmesystem.s3.sa-east-1.amazonaws.com/pulse-ring.png"
                        }
                        alt={"Emblema pulso"}
                    />
                </div>
                <h1 className={styles.mobileTitle + " xl:hidden"}>SYSTEM</h1>
                <h1 className={styles.mobileSubtitle + " xl:hidden"}>PME</h1>
                <form
                    onSubmit={sendLogin}
                    className={
                        "w-full flex justify-center flex-col items-center"
                    }
                >
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoPersonSharp />
                        <input
                            required
                            type="text"
                            value={nick}
                            onChange={(event) => setNick(event.target.value)}
                            placeholder="Nickname"
                            className={poppins.className}
                        />
                    </div>
                    <div
                        className={"mt-6 relative w-[60%] flex justify-center"}
                    >
                        <FaLock />
                        <input
                            required
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            type="password"
                            placeholder="Senha"
                            className={poppins.className}
                        />
                    </div>
                    <a href="/trocar-senha" className={styles.link}>
                        Esqueceu a senha? Troque aqui.
                    </a>
                    <div className="flex w-full justify-center items-center">
                        <a
                            href="/ativar-conta"
                            className={
                                poppins.className + " " + styles.formButtons
                            }
                        >
                            ATIVAR CONTA
                        </a>
                        <button
                            type="submit"
                            className={
                                poppins.className +
                                " ml-12 " +
                                styles.formButtons
                            }
                        >
                            ENTRAR
                        </button>
                    </div>
                </form>
                <div className={styles.stroke} />
                <h3 className={poppins.className}>Acesse nosso discord</h3>
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
                <h3 className={poppins.className + " mt-16"}>
                    Esse site não tem vínculos com a Sulake Inc.
                </h3>
            </aside>
        </main>
    );
}
