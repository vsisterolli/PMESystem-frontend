"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu/Menu";

import "tippy.js/dist/tippy.css";
import "tippy.js/dist/tippy.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import { Alatsi, Bayon, Poppins } from "next/font/google";

import { catchErrorMessage, client } from "@/api/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
import {
    FaChalkboardTeacher,
    FaClipboardList,
    FaHandshake,
    FaRegUserCircle
} from "react-icons/fa";
import {
    IoIosCheckmarkCircle,
    IoMdCheckmarkCircleOutline
} from "react-icons/io";
import { useUserContext } from "@/app/Context/context";
import { FiXOctagon } from "react-icons/fi";
import { SiIfixit } from "react-icons/si";

let timer;

export default function PostClass() {
    const { userData, clearContext } = useUserContext();
    const menuState = useState("hidden");

    const [approved, setApproved] = useState("");
    const [approvedHeight, setApprovedHeight] = useState(68);

    const [failed, setFailed] = useState("");
    const [failedHeight, setFailedHeight] = useState(68);

    const [description, setDescription] = useState("");
    const [descriptionHeight, setDescriptionHeight] = useState("");

    const [course, setCourse] = useState(0);
    const [checkbox, setCheckbox] = useState(false);
    const [classroom, setClassroom] = useState("Sala - 1");

    const router = useRouter();

    const [coursesAllowed, setCoursesAllowed] = useState([
        { acronym: "Selecione o curso", departament: "" }
    ]);

    useEffect(() => {
        client
            .get("/departaments/coursesAllowedToPost", {
                headers: { Authorization: userData?.access_token }
            })
            .then((response) => setCoursesAllowed(response.data))
            .catch(() => {
                toast.error(
                    "Opa! Você precisa estar logado para acessar essa página."
                );
                clearContext();
            });
    }, []);
    async function sendActivity(event) {
        event.preventDefault();
        if (course.acronym === "unselected")
            return toast.error("Selecione um curso");

        client
            .post(
                "/departaments/class",
                {
                    courseAcronym: coursesAllowed[course].acronym,
                    description,
                    failed: failed.split("\n"),
                    approved: approved.split("\n"),
                    room: classroom
                },
                { headers: { Authorization: userData?.access_token } }
            )
            .then(() => {
                toast.success("Aula publicada com sucesso.");
                router.replace(
                    "/aulas/" + coursesAllowed[course].departament.toLowerCase()
                );
            })
            .catch((e) => catchErrorMessage(e));
    }

    return (
        <main className={"min-h-screen min-w-screen " + styles.activities}>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <div className={"flex items-center justify-center flex-col"}>
                <form onSubmit={sendActivity} className={styles.activityForm}>
                    <h2 className={poppins.className}>PUBLICAR AULA</h2>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoIosCheckmarkCircle />
                        <textarea
                            rows={10}
                            style={{ height: `${approvedHeight}px` }}
                            onInput={(event) =>
                                setApprovedHeight(event.target.scrollHeight)
                            }
                            placeholder="Nickname dos aprovados. (pule 1 linha por nick)"
                            className={poppins.className}
                            maxLength={4000}
                            value={approved}
                            onChange={(event) =>
                                setApproved(event.target.value)
                            }
                        />
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <SiIfixit />
                        <textarea
                            rows={10}
                            style={{ height: `${failedHeight}px` }}
                            onInput={(event) =>
                                setFailedHeight(event.target.scrollHeight)
                            }
                            placeholder="Nickname dos reprovados. (pule 1 linha por nick)"
                            className={poppins.className}
                            maxLength={4000}
                            value={failed}
                            onChange={(event) => setFailed(event.target.value)}
                        />
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <FaChalkboardTeacher />
                        <select
                            required
                            className={poppins.className}
                            value={course}
                            onChange={(event) => setCourse(event.target.value)}
                        >
                            <option value={"unselected"}>
                                Selecione o curso
                            </option>
                            {coursesAllowed.map((course, index) => (
                                <option key={course.acronym} value={index}>
                                    {course.acronym}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <IoMdCheckmarkCircleOutline />
                        <select
                            required
                            className={poppins.className}
                            value={classroom}
                            onChange={(event) =>
                                setClassroom(event.target.value)
                            }
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(
                                (value) => (
                                    <option key={value}>Sala - {value}</option>
                                )
                            )}
                        </select>
                    </div>
                    <div className={"relative w-[60%] flex justify-center"}>
                        <FaClipboardList />
                        <textarea
                            required
                            style={{ height: `${descriptionHeight}px` }}
                            placeholder="Descrição"
                            className={poppins.className}
                            maxLength={4000}
                            value={description}
                            onInput={(event) =>
                                setDescriptionHeight(event.target.scrollHeight)
                            }
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
                        />
                    </div>
                    <div className={styles.checkbox}>
                        <input
                            required
                            type="checkbox"
                            className={poppins.className}
                            value={checkbox}
                            onClick={(event) => setCheckbox(event.target.value)}
                        />
                        <h4>
                            Confirmo ter verificado as condições para postar
                            essa atividade e estou ciente de possíveis punições
                            em caso de erros
                        </h4>
                    </div>
                    <button type="submit" className={styles.formButtons}>
                        PUBLICAR
                    </button>
                </form>
            </div>
        </main>
    );
}
