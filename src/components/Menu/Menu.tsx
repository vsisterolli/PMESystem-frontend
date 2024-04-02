"use client";

import styles from "./style.module.css";
import Image from "next/image";
import { Alata } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaChalkboardTeacher,
    FaChevronLeft, FaClipboardList, FaExchangeAlt,
    FaHandshake, FaList, FaUsers
} from "react-icons/fa";
import {
    IoIosArrowDown,
    IoIosArrowUp,
    IoIosHome,
    IoMdCheckmarkCircleOutline
} from "react-icons/io";
import { MdOutlineDocumentScanner } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import { useUserContext } from "@/app/Context/context";
import { GrConfigure } from "react-icons/gr";
import {IoDocumentSharp} from "react-icons/io5";
import {client} from "@/api/axios";
import {toast} from "react-toastify";
import {GiGraduateCap} from "react-icons/gi";
import Link from "next/link";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Menu({ menuState }) {
    const { userData, clearContext, setUserData } = useUserContext();
    const [userClassRole, setUserClassRole] = useState(false);
    const [visibility, setVisibility] = menuState;
    const [manageableDepartaments, setManageableDepartaments] = useState([]);
    const [docDropdownVisibility, setDocDropdownVisibility] =
        useState("hidden");
    const [instructionsDropwdownVisibility, setInstructionsDropdownVisibility] =
      useState("hidden");
    const [classesDropdownVisibility, setClassesDropdownVisibility] =
        useState("hidden");
    const [manageDropdownVisibility, setManageDropdownVisibility] =
        useState("hidden");
    const [activitiesDropdownVisibility, setActivitiesDropdownVisibility] =
      useState("hidden");
    const [listagesDropdownVisibility, setListagesDropdownVisibility] = useState("hidden");
    const [cfoDropdown, setCfoDropdown] = useState("hidden");

    const router = useRouter();

    function handleLogout() {
        clearContext();
    }

    useEffect(() => {
        client.get("/users/self", {headers: {Authorization: userData.access_token}})
          .then(response => setUserData({...response.data, access_token: userData.access_token}))
          .catch(e => {
            console.log(e)
          })

        if (
            userData?.role.name === "Supremo" ||
            userData?.role.name === "Conselheiro"
        ) {
            setUserClassRole([
                { departament: "INS" },
                { departament: "EFEX" },
                { departament: "CDO" },
                { departament: "ESP" }
            ]);
            setManageableDepartaments([
                "INS",
                "EFEX",
                "CDO",
                "ESP",
                "CDT",
                "MKT",
                "RH",
                "PTR"
            ]);
        } else {
            const depsToManage = [],
                classRoles = [];
            userData?.userDepartamentRole?.forEach((role) => {
                if (role.departamentRoles?.powerLevel >= 10)
                    depsToManage.push(role.departamentRoles?.departament);
            });

            if (depsToManage.length) setManageableDepartaments(depsToManage);

            userData.userDepartamentRole?.forEach((role) => {
                console.log(role)
                if (
                    role.departamentRoles?.departament === "INS" ||
                    role.departamentRoles?.departament === "EFEX" ||
                    role.departamentRoles?.departament === "CDO" ||
                    role.departamentRoles?.departament === "ESP"
                )
                    classRoles.push(role.departamentRoles);
            });

            if (classRoles.length) setUserClassRole(classRoles);
        }

        if (userData.nick === "") {
            router.replace("/login?redirected=true");
        }
    }, []);

    return (
        <aside
            className={
                "flex flex-col min-h-screen overflow-scroll overflow-x-clip w-full w-screen md:w-[350px] fixed " +
                visibility +
                " " +
                styles.menu
            }
        >
            <div
                onClick={() => router.replace("/profile?nick=" + userData.nick)}
                className={styles.portrait + " cursor-pointer"}
            >
                <Image
                    width={150}
                    height={222}
                    src={`https://www.habbo.com.br/habbo-imaging/avatarimage?img_format=png&user=${userData.nick}&direction=3&head_direction=3&size=l&gesture=sml&action=std`}
                    alt={"Seu habbo avatar"}
                />
            </div>
            <div
                className={styles.closeArrow}
                onClick={() => setVisibility("hidden")}
            >
                <FaChevronLeft />
                <div></div>
            </div>
            <h3 className={alata.className + " text-center mt-4"}>
                {userData.nick}
            </h3>
            <h4 className={alata.className + " text-center"}>
                {userData.role.name}
            </h4>
            <div
              className={styles.options + " md:ml-[46px] " + alata.className}
            >
                <a href="/home">
                    <div className={styles.option}>
                        <IoIosHome/>
                        <button>Home</button>
                    </div>
                </a>
                <div
                  onClick={() =>
                    setDocDropdownVisibility(
                      docDropdownVisibility === "hidden"
                        ? "flex"
                        : "hidden"
                    )
                  }
                  className={styles.option}
                >
                    <MdOutlineDocumentScanner/>
                    <button>Documentos</button>
                    <IoIosArrowDown
                      className={
                        (docDropdownVisibility === "hidden"
                          ? "flex"
                          : "hidden") +
                        " " +
                        styles.arrowDown
                      }
                    />
                    <IoIosArrowUp
                      className={
                        docDropdownVisibility + " " + styles.arrowDown
                      }
                    />
                </div>
                <div
                  className={
                    `pl-4 ${docDropdownVisibility} ` + styles.dropdown
                  }
                >
                    <Link
                      className="block"
                      href={"/document/estatuto"}
                    >
                        Estatuto Oficial
                    </Link>
                    <Link
                      className="block"
                      href={"/document/cd"}
                    >
                        Código Disciplinar
                    </Link>
                    <Link
                      className="block"
                      href={"/document/pm"}
                    >
                        Protocolo Militar
                    </Link>
                    <Link
                      className="block"
                      href={"/document/uniforme"}
                    >
                        Identificação Militar
                    </Link>
                </div>
                <div
                  onClick={() =>
                    setInstructionsDropdownVisibility(
                      instructionsDropwdownVisibility === "hidden"
                        ? "flex"
                        : "hidden"
                    )
                  }
                  className={styles.option}
                >
                    <IoDocumentSharp/>
                    <button>Apostilas</button>
                    <IoIosArrowDown
                      className={
                        (instructionsDropwdownVisibility === "hidden"
                          ? "flex"
                          : "hidden") +
                        " " +
                        styles.arrowDown
                      }
                    />
                    <IoIosArrowUp
                      className={
                        instructionsDropwdownVisibility + " " + styles.arrowDown
                      }
                    />
                </div>
                <div
                  className={
                    `pl-4 ${instructionsDropwdownVisibility} ` + styles.dropdown
                  }
                >
                    <Link
                      className="block"
                      href={"/document/ecb"}
                    >
                        - ECb
                    </Link>
                    <Link
                      className="block"
                      href={ "/document/esgt"}
                    >
                        - ESgt
                    </Link>
                    <Link
                      className="block"
                      href={"/document/cort"}
                    >
                        - COrt
                    </Link>
                    <Link
                      className="block"
                      href={"/document/cpp"}
                    >
                        - CPP
                    </Link>
                    <Link
                      className="block"
                      href={"/document/esbt"}
                    >
                        - ESbt
                    </Link>
                    <Link
                      className="block"
                      href={"/document/cfpe"}
                    >
                        - CFPE
                    </Link>
                    <Link
                      className="block"
                      href={"/document/cfc"}
                    >
                        - CFC
                    </Link>
                    <Link
                      className="block"
                      href={"/document/capex"}
                    >
                        - CApEx
                    </Link>
                </div>
                {userData?.role.hierarchyPosition >= 5 &&
                  <>
                      <div
                        onClick={() =>
                          setCfoDropdown(
                            cfoDropdown === "hidden"
                              ? "flex"
                        : "hidden"
                    )
                  }
                  className={styles.option}
                >
                    <GiGraduateCap />
                    <button>CFO</button>
                    <IoIosArrowDown
                      className={
                        (cfoDropdown === "hidden"
                          ? "flex"
                          : "hidden") +
                        " " +
                        styles.arrowDown
                      }
                    />
                    <IoIosArrowUp
                      className={
                        cfoDropdown + " " + styles.arrowDown
                      }
                    />
                </div>
                      <div
                        className={
                          `pl-4 ${cfoDropdown} ` + styles.dropdown
                        }
                      >
                          <Link
                            className="block"
                            href={"/document/cfoinicial"}
                          >
                              Instruções Iniciais
                          </Link>
                          <Link
                            className="block"
                            href={"/document/m1teorico"}
                          >
                              Módulo I - Apostila
                          </Link>
                          <Link
                            className="block"
                            href={"/document/m1pratico"}
                          >
                              Módulo I - Avaliação
                          </Link>
                          <Link
                            className="block"
                            href={"/document/m2teorico"}
                          >
                              Módulo II - Apostila
                          </Link>
                          <Link
                            className="block"
                            href={"/document/m2pratico"}
                          >
                              Módulo II - Avaliação
                          </Link>
                          <button className="block">
                              <a target="_blank" href="https://docs.google.com/forms/d/1o0ocPA4_s_WYr_yRdRX3HoPZm4wMz2PK76nIfaZkHWs/viewform?edit_requested=true">Agendamento - Prática</a>
                          </button>
                      </div>
                  </>
                }

                {userClassRole && (
                  <>
                      <div
                        onClick={() =>
                          setClassesDropdownVisibility(
                            classesDropdownVisibility === "hidden"
                              ? "flex"
                              : "hidden"
                          )
                        }
                        className={styles.option}
                      >
                          <FaChalkboardTeacher/>
                          <button>Aulas</button>
                          <IoIosArrowDown
                            className={
                              (classesDropdownVisibility === "hidden"
                                ? "flex"
                                : "hidden") +
                              " " +
                              styles.arrowDown
                            }
                          />
                          <IoIosArrowUp
                            className={
                              classesDropdownVisibility +
                              " " +
                              styles.arrowDown
                            }
                          />
                      </div>
                      <div
                        className={
                          `pl-4 ${classesDropdownVisibility} ` +
                          styles.dropdown
                        }
                      >
                          {userClassRole.map((role) => (
                            <Link
                              key={role.departament}
                              className="block"
                              href={"/aulas/" + role.departament.toLowerCase()}
                            >
                                - {role.departament}
                            </Link>
                          ))}
                      </div>
                  </>
                )}
                {!(userData.role.name === "Supremo" || userData.role.name === "Conselheiro" || manageableDepartaments.includes("RH")) && <div
                  className={styles.option}
                  onClick={() => router.replace("/atividades")}
                >
                        <IoMdCheckmarkCircleOutline/>
                        <button>Atividades</button>
                </div>
                }
                {(userData.role.name === "Supremo" || userData.role.name === "Conselheiro" || manageableDepartaments.includes("RH")) &&
                  <>
                  <div
                    onClick={() =>
                      setActivitiesDropdownVisibility(
                        activitiesDropdownVisibility === "hidden"
                          ? "flex"
                          : "hidden"
                      )
                    }
                    className={styles.option}
                  >
                      <IoMdCheckmarkCircleOutline/>
                      <button>Atividades</button>
                      <IoIosArrowDown
                        className={
                          (activitiesDropdownVisibility === "hidden"
                            ? "flex"
                            : "hidden") +
                          " " +
                          styles.arrowDown
                        }
                      />
                      <IoIosArrowUp
                        className={
                          activitiesDropdownVisibility +
                          " " +
                          styles.arrowDown
                        }
                      />
                  </div>
                    <div
                    className={
                    `pl-4 ${activitiesDropdownVisibility} ` +
                    styles.dropdown
                }
            >
                <Link href={"/atividades"}>Padrão</Link>
                <Link href={"/atividades/rh"}>Em massa</Link>
            </div>
                  </>
                }
                {(userData.role.name === "Supremo" ||
                  userData.role.name === "Conselheiro") && (
                  <div
                    className={styles.option}
                    onClick={() => router.replace("/contratar")}
                  >
                      <FaHandshake/>
                      <button>Contratar</button>
                  </div>
                )}
                {(userData.role?.hierarchyPosition > 10 &&
                  <div
                    className={styles.option}
                    onClick={() => router.replace("/mudar-nick")}
                  >
                      <FaExchangeAlt/>
                      <button>Mudar Nick</button>
                  </div>
                )}
                {manageableDepartaments.length > 0 && (
                  <>
                      <div
                        onClick={() =>
                          setManageDropdownVisibility(
                            manageDropdownVisibility === "hidden"
                              ? "flex"
                              : "hidden"
                          )
                        }
                        className={styles.option}
                      >
                          <GrConfigure/>
                          <button>Gerenciar Dpto</button>
                          <IoIosArrowDown
                            className={
                              (manageDropdownVisibility === "hidden"
                                ? "flex"
                                : "hidden") +
                              " " +
                              styles.arrowDown
                            }
                          />
                          <IoIosArrowUp
                            className={
                              manageDropdownVisibility +
                              " " +
                              styles.arrowDown
                            }
                          />
                      </div>
                      <div
                        className={
                          `pl-4 ${manageDropdownVisibility} ` +
                          styles.dropdown
                        }
                      >
                          {manageableDepartaments.map((departament) => (
                            <button
                              onClick={() => {
                                  router.replace(
                                    "/gerenciar/" +
                                    departament.toLowerCase()
                                  );
                              }}
                              key={departament}
                            >
                                - {departament}
                            </button>
                          ))}
                      </div>
                  </>
                )}
                <div
                  className={styles.option}
                  onClick={() => router.replace("/policiais")}
                >
                    <FaUsers/>
                    <button>Controle de Policiais</button>
                </div>
                <div
                  onClick={() =>
                    setListagesDropdownVisibility(
                      listagesDropdownVisibility === "hidden"
                        ? "flex"
                        : "hidden"
                    )
                  }
                  className={styles.option}
                >
                    <FaList/>
                    <button>Listagens</button>
                    <IoIosArrowDown
                      className={
                        (listagesDropdownVisibility === "hidden"
                          ? "flex"
                          : "hidden") +
                        " " +
                        styles.arrowDown
                      }
                    />
                    <IoIosArrowUp
                      className={
                        listagesDropdownVisibility + " " + styles.arrowDown
                      }
                    />
                </div>
                <div
                  className={
                    `pl-4 ${listagesDropdownVisibility} ` + styles.dropdown
                  }
                >
                    <button
                      className="block"
                      onClick={() => router.replace("/rh/promocoes")}
                    >
                        Promoções
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/bonificacoes")}
                    >
                        Bonificações
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/rh/advertencias")}
                    >
                        Advertências
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/rh/rebaixamentos")}
                    >
                        Rebaixamentos
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/rh/demissoes")}
                    >
                        Demissões
                    </button>
                </div>
                <div onClick={handleLogout} className={styles.option}>
                    <CiLogout/>
                    <button>Logout</button>
                </div>
            </div>
            <div className={styles.emblema + " "}>
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
        </aside>
    );
}
