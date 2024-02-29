"use client";

import styles from "./style.module.css";
import Image from "next/image";
import { Alatsi, League_Gothic, Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { client, catchErrorMessage } from "@/api/axios";
import moment from "moment";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/app/Context/context";
import {IoPersonSharp} from "react-icons/io5";
import {FaCode, FaLock} from "react-icons/fa";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });
const leagueGothic = League_Gothic({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "700" });

export default function LoginPage() {
    const { setUserData } = useUserContext();
    const [nick, setNick] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [session, setSession] = useState({
        id: "",
        code: "",
        expiresAt: ""
    });
    const router = useRouter();

    function askNewSession() {
        client
            .post("/auth/session")
            .then((response) => {
                setSession(response.data);
                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        "session",
                        JSON.stringify(response.data)
                    );
                }
            })
            .catch((error) => catchErrorMessage(error));
    }

    // @ts-expect-error
    useEffect(() => {
        const currentSession = localStorage.getItem("session");
        if (
            currentSession &&
            moment().isBefore(JSON.parse(currentSession).expiresAt)
        ) {
            setSession(JSON.parse(currentSession));
            return;
        }
        askNewSession();
    }, []);

    async function sendActivation(event) {
        event?.preventDefault();
        if (password !== confirmPassword) {
            toast.error("As senhas não batem!");
            return;
        }

        await client
            .patch("/users/activate", {
                sessionId: session.id,
                nick: nick,
                password: password
            })
            .then(async () => {
                toast.success("Conta ativada com sucesso.");
                const response = await client.post("/auth/login", {
                    nick,
                    password,
                    sessionId: session.id
                });
                setUserData(response.data);
                router.replace("/home");
            })
            .catch((error) => {
                if (moment().isAfter(session.expiresAt)) askNewSession();
                catchErrorMessage(error);
            });
    }

    return (
        <main className="flex min-h-screen min-w-screen">
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
                    ATIVE
                </h2>
                <h2 className={poppins.className + " " + styles.pageSubtitle}>
                    SUA CONTA
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
                <form
                    onSubmit={sendActivation}
                    className={
                        "w-full flex justify-center flex-col items-center"
                    }
                >
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoPersonSharp />
                        <input
                            required
                            value={nick}
                            onChange={(event) => setNick(event.target.value)}
                            type="text"
                            placeholder="Nickname"
                            className={poppins.className}
                        />
                    </div>
                    <h3 className={poppins.className + " mt-2 w-[60%]"}>
                        O nickname deve ser igual ao do habbo.
                    </h3>

                    <div
                        className={"mt-6 relative w-[60%] flex justify-center"}
                    >
                        <FaLock />
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            type="password"
                            placeholder="Senha"
                            className={poppins.className}
                        />
                    </div>
                    <h3 className={poppins.className + " mt-2 w-[60%]"}>
                        Use no mínimo 8 caracteres, 1 dígito, 1 letra e 1
                        caractere especial.
                    </h3>

                    <div
                        className={"mt-6 relative w-[60%] flex justify-center"}
                    >
                        <FaLock />
                        <input
                            required
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
                            type="password"
                            placeholder="Confirme a senha."
                            className={poppins.className}
                        />
                    </div>
                    <h3 className={poppins.className + " mt-2 w-[60%]"}>
                        Tenha certeza de que as senhas digitadas estão iguais.
                    </h3>

                    <div
                        className={"mt-6 relative w-[60%] flex justify-center"}
                    >
                        <FaCode/>
                        <input
                            type="text"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    "PME" + session.code
                                );
                                toast.success("Código copiado.");
                            }}
                            value={"PME" + session.code}
                            readOnly
                            className={poppins.className + " cursor-pointer"}
                        />
                    </div>
                    <h3 className={poppins.className + " mt-2 w-[60%]"}>
                        Coloque esse código na sua missão do Habbo Hotel.
                    </h3>

                    <div className="flex w-full justify-center items-center">
                        <a
                            href="/login?redirected=true"
                            className={
                                poppins.className + " " + styles.formButtons
                            }
                        >
                            VOLTAR
                        </a>
                        <button
                            type="submit"
                            className={
                                poppins.className +
                                " ml-12 " +
                                styles.formButtons
                            }
                        >
                            ATIVAR CONTA
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
