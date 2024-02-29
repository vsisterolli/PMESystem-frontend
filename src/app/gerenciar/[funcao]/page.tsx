"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu/Menu";

import { Bayon, Poppins } from "next/font/google";
import Image from "next/image";
import { catchErrorMessage, client } from "@/api/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
import { FaRegUserCircle } from "react-icons/fa";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useUserContext } from "@/app/Context/context";
import moment from "moment/moment";
import ConfirmDelete from "@/app/gerenciar/[funcao]/confirmDelete";

let timer;

export default function Manage({ params }) {
    const menuState = useState("hidden");
    const [imageNick, setImageNick] = useState("");
    const [nick, setNick] = useState("");
    const [roles, setRoles] = useState([]);
    const [departamentUsers, setDepartamentUsers] = useState([]);
    const [option, setOption] = useState("unselected");
    const { userData } = useUserContext();
    const visibilityState = useState("hidden");
    const [visibility, setVisibilityState] = visibilityState;
    const [futureDeleted, setFutureDeleted] = useState("")

    const router = useRouter();
    useEffect(() => {
        setImg({ target: { value: userData.nick } });
        client
            .get("/departaments/roles/" + params.funcao.toUpperCase(), {
                headers: { Authorization: userData?.access_token }
            })
            .then((response) => {
                setRoles(response.data);
            })
            .catch(() => {
                toast.error(
                    "Opa! Você não tem permissão para gerenciar essa função."
                );
                router.replace("/home");
            });

        client
            .get("/departaments/users/" + params.funcao.toUpperCase(), {
                headers: { Authorization: userData?.access_token }
            })
            .then((response) => {
                setDepartamentUsers(response.data);
            })
            .catch((e) => catchErrorMessage(e));
    }, []);

    function setImg(event) {
        if (event.target.value === "") setImageNick(userData.nick);
        else setImageNick(event.target.value);
    }

    const debounce = (event) => {
        setNick(event.target.value);
        clearTimeout(timer);
        timer = setTimeout(() => setImg(event), 1500);
    };

    async function sendActivity(event) {
        event.preventDefault();
        if (option === "unselected") {
            toast.error("Selecione um cargo.");
            return;
        }

        try {
            await client.post(
                "/departaments/user/role",
                { roleName: option, userNick: nick },
                { headers: { Authorization: userData.access_token } }
            );
            toast.success(
                `O cargo de ${nick} foi alterado com sucesso para ${option}`
            );
        } catch (e) {
            catchErrorMessage(e);
        }
    }

    return (
        <main className={"min-h-screen min-w-screen " + styles.activities}>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <ConfirmDelete futureDeleted={futureDeleted} visibilityState={visibilityState} departament={params.funcao}/>
            <div className={"flex items-center justify-center flex-col"}>
                <div
                    className={
                        "flex flex-col items-center justify-center " +
                        styles.portrait
                    }
                >
                    <Image
                        width={150}
                        height={222}
                        src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${imageNick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                        alt={"Seu habbo avatar"}
                    />
                    <div
                        className={
                            styles.blackRectangle + " " + bayon.className
                        }
                    >
                        {imageNick}
                    </div>
                </div>
                <form onSubmit={sendActivity} className={styles.activityForm}>
                    <h2 className={poppins.className}>
                        GERENCIAR {params.funcao.toUpperCase()}
                    </h2>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <FaRegUserCircle />
                        <input
                            required
                            type="text"
                            placeholder="Nickname do policial"
                            className={poppins.className}
                            value={nick}
                            onChange={debounce}
                        />
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoMdCheckmarkCircleOutline />
                        <select
                            required
                            className={poppins.className}
                            value={option}
                            onChange={(event) => setOption(event.target.value)}
                        >
                            <option value={"unselected"}>
                                Selecione o novo cargo
                            </option>
                            {roles.map((role) => (
                                <option>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className={"mb-8 " + styles.formButtons}
                    >
                        ADICIONAR CARGO
                    </button>
                </form>
            </div>
            <table>
                <tr>
                    <th className={"border-r-2 border-solid border-white"}>
                        Nick
                    </th>
                    <th className={"border-r-2 border-solid border-white"}>
                        Cargo
                    </th>
                    <th className={"border-r-2 border-solid border-white"}>
                        Data de Promoção/Entrada
                    </th>
                    <th>Remover da Função</th>
                </tr>
                {departamentUsers.map((userObj) => (
                    <tr>
                        <td className={"border-r-2 border-solid border-white"}>
                            {userObj?.user?.nick}
                        </td>
                        <td className={"border-r-2 border-solid border-white"}>
                            {userObj?.departamentRoles?.name}
                        </td>
                        <td className={"border-r-2 border-solid border-white"}>
                            {moment(userObj?.createdAt).format(
                                "DD/MM/yyyy HH:mm"
                            )}
                        </td>
                        <td onClick={() => setFutureDeleted(userObj.user.nick)}><Image onClick={() => setVisibilityState("none")} className={styles.removeImg} width={32} height={32} src={"https://pmesystem.s3.sa-east-1.amazonaws.com/x3.png"} alt={"remove"}/></td>
                    </tr>
                ))}
            </table>
        </main>
    );
}
