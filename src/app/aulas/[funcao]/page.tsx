"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu/Menu";

import { Alatsi, Raleway } from "next/font/google";

import { useUserContext } from "@/app/Context/context";
import Image from "next/image";
import {
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight
} from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { client } from "@/api/axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import moment from "moment";

const alatsi = Alatsi({ subsets: ["latin"], weight: "400" });
const raleway = Raleway({ subsets: ["latin"], weight: "800" });
let timer;

export default function Home({ params }) {
    const menuState = useState("hidden");
    const { userData } = useUserContext();
    const [search, setSearch] = useState("");
    const [userRole, setUserRole] = useState({ powerLevel: 0 });
    const [maxPages, setMaxPages] = useState(1);
    const [option, setOption] = useState("mine");
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [classes, setClasses] = useState([]);

    const DEPARTMENT_DATA = {
        ins: {
            acronym: "INS",
            fullName: "Departamento de Instrução"
        },
        cdo: {
            acronym: "CDO",
            fullName: "Centro de Desenvolvimento de Oficiais"
        },
        efex: {
            acronym: "EFEx",
            fullName: "Escola de Formação de Executivos"
        },
        esp: {
            acronym: "ESP",
            fullName: "Departamento de Especialização"
        }
    };

    const triggerSearch = async ({ option, search, page }) => {
        client
            .get(
                "/departaments/classes" +
                    `?departament=${params.funcao}&mode=${option}&search=${search}&offset=${(page - 1) * 10}`,
                { headers: { Authorization: userData.access_token } }
            )
            .then((response) => {
                setMaxPages(Math.ceil(response.data[0] / 10));
                setClasses(response.data[1]);
            })
            .catch((e) => {
                console.log(e);
                router.replace("/home");
            });
    };

    const handleSetOption = async (option) => {
        setPage(1);
        setClasses([]);
        setSearch("");
        setOption(option);
        await triggerSearch({ option, search, page: 1 });
    };

    const handlePagination = async (page) => {
        setClasses([]);
        setPage(page);
        triggerSearch({ option, search, page });
    };

    const debounce = async (search) => {
        setSearch(search);
        clearTimeout(timer);
        timer = setTimeout(() => triggerSearch({ option, page, search }), 2000);
    };

    useEffect(() => {
        if (
            params.funcao !== "ins" &&
            params.funcao !== "esp" &&
            params.funcao !== "cdo" &&
            params.funcao !== "efex"
        ) {
            toast.error("Função inexistente.");
            router.replace("/home");
            return;
        }

        client
            .get("/departaments/courses/" + params.funcao.toUpperCase(), {
                headers: { Authorization: userData.access_token }
            })
            .then((response) => setCourses(response.data))
            .catch((e) => {
                toast.error(
                    "Você não tem permissão para acessar os dados dessa função."
                );
                router.replace("/home");
            });
        client
            .get(
                "/departaments/classes" +
                    `?departament=${params.funcao}&mode=mine`,
                { headers: { Authorization: userData.access_token } }
            )
            .then((response) => {
                setMaxPages(Math.ceil(response.data[0] / 10));
                setClasses(response.data[1]);
            })
            .catch((e) => {
                router.replace("/home");
            });
        userData.userDepartamentRole.forEach((role) => {
            if (role.departamentRoles?.departament === params.funcao.toUpperCase())
                setUserRole(role.departamentRoles);
        });
    }, [params.funcao]);

    console.log(userRole)
    return (
        <main className={"min-h-screen min-w-screen " + styles.home}>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <div className={styles.content + " "}>
                <div
                    className={
                        styles.capeAndIcon +
                        " flex items-center justify-center mt-16"
                    }
                >
                    <div
                        className={
                            "flex items-center justify-center " +
                            styles.portrait
                        }
                    >
                        <Image
                            width={200}
                            height={200}
                            src={`https://pmesystem.s3.sa-east-1.amazonaws.com/${params.funcao}.png`}
                            alt={"Emblema da função"}
                        />
                        <div
                            className={
                                styles.blackRectangle +
                                " flex items-center " +
                                raleway.className
                            }
                        >
                            {DEPARTMENT_DATA[params.funcao]?.acronym}
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url("https://pmesystem.s3.sa-east-1.amazonaws.com/${params.funcao}-capa.png")`
                        }}
                        className={styles.cape + " " + raleway.className}
                    >
                        <div>{DEPARTMENT_DATA[params.funcao]?.fullName}</div>
                    </div>
                </div>
                <div className={styles.historyHolder}>
                    <div>
                        <div className={styles.searchBar}>
                            <IoIosSearch />
                            <input
                                value={search}
                                onChange={(event) =>
                                    debounce(event.target.value)
                                }
                                type="text"
                                placeholder="Pesquisa..."
                            />
                            {(userRole.powerLevel >= 10 ||
                                userData.role.name === "Supremo" ||
                                userData.role.name === "Conselheiro") && (
                                <>
                                    <button
                                        onClick={() => handleSetOption("mine")}
                                        style={{
                                            color:
                                                option === "mine"
                                                    ? "#FFFFFF"
                                                    : "#a4a4a4"
                                        }}
                                        className={
                                            styles.mine +
                                            " " +
                                            raleway.className
                                        }
                                    >
                                        MINHAS
                                    </button>
                                    <button
                                        style={{
                                            color:
                                                option !== "mine"
                                                    ? "#FFFFFF"
                                                    : "#a4a4a4"
                                        }}
                                        onClick={() => handleSetOption("all")}
                                        className={
                                            styles.all + " " + raleway.className
                                        }
                                    >
                                        TODAS
                                    </button>
                                </>
                            )}
                        </div>
                        <table>
                            <tr>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Id
                                </th>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Data
                                </th>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Curso
                                </th>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Sala
                                </th>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Aplicador
                                </th>
                                <th
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                >
                                    Aprovados
                                </th>
                                <th>Reprovados</th>
                            </tr>
                            {classes?.map((appliedClass) => (
                                <tr>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {appliedClass.id}
                                    </td>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {moment(appliedClass.appliedAt).format(
                                            "DD/MM/yyyy HH:mm"
                                        )}
                                    </td>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {appliedClass.courseAcronym}
                                    </td>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {appliedClass.room}
                                    </td>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {appliedClass.author}
                                    </td>
                                    <td
                                        className={
                                            "border-r-2 border-solid border-white"
                                        }
                                    >
                                        {appliedClass.approved}
                                    </td>
                                    <td>{appliedClass.failed}</td>
                                </tr>
                            ))}
                        </table>
                        <div className={styles.navigation}>
                            <MdKeyboardDoubleArrowLeft onClick={() => handlePagination(Math.max(1, page - 10))}/>
                            <MdKeyboardArrowLeft onClick={() => handlePagination(Math.max(1, page - 1))}/>
                            <button
                              onClick={() =>
                                handlePagination(Math.max(page - 10, 1))
                              }
                              className={styles.pageOption}
                            >
                                {Math.max(page - 10, 1)}
                            </button>
                            <button className={styles.pageOption} onClick={() => handlePagination(Math.max(page - 1, 1))}>{Math.max(page - 1, 1)}</button>
                            <button>{page}</button>
                            <button className={styles.pageOption} onClick={() => handlePagination(Math.min(page + 1, maxPages))}>{Math.min(page + 1, maxPages)}</button>
                            <button
                              onClick={() =>
                                handlePagination(
                                  Math.max(
                                    1,
                                    Math.min(page + 10, maxPages)
                                  )
                                )
                              }
                              className={styles.pageOption}
                            >
                                {Math.max(1, Math.min(page + 10, maxPages))}
                            </button>
                            <MdKeyboardArrowRight onClick={() => handlePagination(Math.min(maxPages, page + 1))}/>
                            <MdKeyboardDoubleArrowRight onClick={() => handlePagination(Math.min(maxPages, page + 10))}/>
                        </div>
                    </div>
                    <div className={"flex flex-col items-center ml-12"}>
                        <div className={styles.scripts + " mb-14"}>
                            <div
                                className={
                                    styles.blackRectangleTop +
                                    " flex items-center " +
                                    raleway.className
                                }
                            >
                                SCRIPTS
                            </div>
                            {courses?.map((course) => (
                                <div
                                    onClick={() =>
                                        router.replace(
                                            "/script/" + course.acronym
                                        )
                                    }
                                    className={
                                        "flex items-center pr-4 " +
                                        alatsi.className
                                    }
                                >
                                    <Image
                                        width={80}
                                        height={120}
                                        src={
                                            "https://pmesystem.s3.sa-east-1.amazonaws.com/document-with-stamp-and-pen-business-documents-vector-31048853-removebg-preview.png"
                                        }
                                        alt={"Pencil"}
                                    />
                                    {course.name}
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => router.replace("/aplicar")}
                            className={styles.applyButton}
                        >
                            APLICAR AULA
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
