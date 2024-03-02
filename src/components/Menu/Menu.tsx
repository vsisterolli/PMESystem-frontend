"use client";

import styles from "./style.module.css";
import Image from "next/image";
import { Alata } from "next/font/google";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaChalkboardTeacher,
    FaChevronLeft,
    FaHandshake
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

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Menu({ menuState }) {
    const { userData, clearContext, setUserData } = useUserContext();
    const [userClassRole, setUserClassRole] = useState(false);
    const [visibility, setVisibility] = menuState;
    const [manageableDepartaments, setManageableDepartaments] = useState(false);
    const [docDropdownVisibility, setDocDropdownVisibility] =
        useState("hidden");
    const [instructionsDropwdownVisibility, setInstructionsDropdownVisibility] =
      useState("hidden");
    const [classesDropdownVisibility, setClassesDropdownVisibility] =
        useState("hidden");
    const [manageDropdownVisibility, setManageDropdownVisibility] =
        useState("hidden");

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
                "flex flex-col min-h-screen overflow-y-auto overflow-x-clip w-full w-screen md:w-[350px] fixed " +
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
                    <button
                      className="block"
                      onClick={() => router.replace("/document/estatuto")}
                    >
                        Estatuto Oficial
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/document/cd")}
                    >
                        Código Disciplinar
                    </button>
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
                    <IoDocumentSharp />
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
                    <button
                      className="block"
                      onClick={() => router.replace("/document/ecb")}
                    >
                        - ECb
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/document/esgt")}
                    >
                        - ESgt
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/document/cort")}
                    >
                        - COrt
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/document/cpp")}
                    >
                        - CPP
                    </button>
                    <button
                      className="block"
                      onClick={() => router.replace("/document/esbt")}
                    >
                        - ESbt
                    </button>
                </div>

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
                            <button
                              key={role.departament}
                              className="block"
                              onClick={() =>
                                router.replace(
                                  "/aulas/" +
                                  role.departament.toLowerCase()
                                )
                              }
                            >
                                - {role.departament}
                            </button>
                          ))}
                      </div>
                  </>
                )}
                <div
                  className={styles.option}
                  onClick={() => router.replace("/atividades")}
                >
                    <IoMdCheckmarkCircleOutline/>
                    <button>Atividades</button>
                </div>
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
                {manageableDepartaments && (
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
