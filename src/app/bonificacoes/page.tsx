"use client";

import Header from "@/components/Header/Header";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import Menu from "@/components/Menu/Menu";

import {Bayon, Beth_Ellen, Raleway} from "next/font/google";

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

const beth = Beth_Ellen({ subsets: ["latin"], weight: "400" });
const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const raleway = Raleway({ subsets: ["latin"], weight: "700" });
let timer;

export default function Home({ params }) {
    const menuState = useState("hidden");
    const { userData } = useUserContext();
    const [search, setSearch] = useState("");
    const [maxPages, setMaxPages] = useState(1);
    const [option, setOption] = useState("mine");
    const [weeklyTop, setWeeklyTop] = useState([])
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [actions, setActions] = useState([]);

    const triggerSearch = async ({ option, search, page }) => {
        client
            .get(
                "/actions/bonifications" +
                    `?mode=${option}&search=${search}&offset=${(page - 1) * 10}`,
                { headers: { Authorization: userData.access_token } }
            )
            .then((response) => {
                setMaxPages(Math.ceil(response.data[0] / 10));
                setActions(response.data[1]);
            })
            .catch((e) => {
                console.log(e);
                router.replace("/home");
            });
    };

    const handleSetOption = async (option) => {
        setActions([]);
        setSearch("");
        setPage(1);
        setOption(option);
        await triggerSearch({ option, search, page: 1 });
    };

    const handlePagination = async (page) => {
        setActions([]);
        setPage(page);
        triggerSearch({ option, search, page });
    };

    const debounce = async (search) => {
        setSearch(search);
        clearTimeout(timer);
        timer = setTimeout(() => triggerSearch({ option, page, search }), 2000);
    };

    useEffect(() => {
        client
            .get(
                "/actions/bonifications" +
                    `?&mode=mine`,
                { headers: { Authorization: userData.access_token } }
            )
            .then((response) => {
                setMaxPages(Math.ceil(response.data[0] / 10));
                setActions(response.data[1]);
            })
            .catch(() => {
                router.replace("/home");
            });
        
        client.get(
          "/actions/mostBonificationsWeekly", {headers: { Authorization: userData.access_token }}
        ).then(response => {
            setWeeklyTop(response.data)
        }).catch(() => router.replace("/home"))
    }, []);

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
                            src={`https://pmesystem.s3.sa-east-1.amazonaws.com/rh.png`}
                            alt={"Emblema da função"}
                        />
                        <div
                            className={
                                styles.blackRectangle +
                                " flex items-center " +
                                raleway.className
                            }
                        >
                            RH
                        </div>
                    </div>
                    <div
                        style={{
                            backgroundImage: `url("https://pmesystem.s3.sa-east-1.amazonaws.com/rh-capa.png")`
                        }}
                        className={styles.cape + " " + raleway.className}
                    >
                        <div>Recursos Humanos</div>
                    </div>
                </div>
                <div className={styles.historyHolder}>
                    <div className={"mr-8 " + styles.topHolder}>
                        <div className={styles.topTitleHolder}>
                            <h4 className={bayon.className}>TOP 5</h4>
                            <h5 className={beth.className}>Bonificados da Semana</h5>
                        </div>
                        {console.log(weeklyTop)}
                        {weeklyTop.map(user =>
                        <div className={styles.topUser}>
                            <div className={styles.topUserPortrait}>
                                <Image
                                  width={150}
                                  height={222}
                                  src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${user.nick}&direction=2&head_direction=3&size=l&gesture=sml&action=std`}
                                  alt={"Seu habbo avatar"}
                                />
                            </div>
                            <p className={raleway.className}>{user.nick} - {user.totalgains}  bonificações</p>
                        </div>
                        )}
                    </div>
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
                                    Autor
                                </th>
                                <th
                                  className={
                                      "border-r-2 border-solid border-white"
                                  }
                                >
                                    Bonificado
                                </th>
                                <th
                                  className={
                                      "border-r-2 border-solid border-white"
                                  }
                                >
                                    Motivo
                                </th>
                                <th
                                >
                                    Atribuições
                                </th>
                            </tr>
                            {actions?.map((action) => (
                              <tr>
                                  <td
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                  >
                                      {action.id}
                                  </td>
                                  <td
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                  >
                                      {moment(action.createdAt).format(
                                        "DD/MM/yyyy HH:mm"
                                      )}
                                  </td>
                                  <td
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                  >
                                      {action.author}
                                  </td>
                                  <td
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                  >
                                      {action.user.nick}
                                  </td>
                                  <td
                                    className={
                                        "border-r-2 border-solid border-white"
                                    }
                                  >
                                      {action.reason}
                                  </td>
                                  <td
                                  >
                                      {action.gains}
                                  </td>
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
                </div>
            </div>
        </main>
    );
}
