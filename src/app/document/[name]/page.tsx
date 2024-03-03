"use client";

import Header from "@/components/Header/Header";
import styles from "./style.module.css";
import { Alata } from "next/font/google";
import { client } from "@/api/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Menu from "@/components/Menu/Menu";
import { useUserContext } from "@/app/Context/context";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Document({ params }) {
    const menuState = useState("hidden");
    const documents = {
        cd: {
            title: "Código Disciplinar - PME ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vQy9pTk0-E8eXK9b1SG7_31gUpdIWn5xNPNMTXKC1UFXLCMqHcl6mWakgmY88XFK1u82WflQ6G52XCu/pub?embedded=true"
        },
        estatuto: {
            title: "Estatuto - PME ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vTLDOk0UC39qryN0KwhPoawzeWGuzUvtoL8oZ0-8JOozM2vJX0FkDmElOLz94Skwb5nKvKrZ66lwhPQ/pub?embedded=true"
        },
        ecb: {
            title: "[PME] Apostila - Especialização de Cabos ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vRkaa9c27F0QffyYgHR7vn00dSSQm_WR34No92858gzFFSrKKMmx1seGaNVj6CrNTM27vpqFRrzxMNb/pub?embedded=true"
        },
        esgt: {
            title: "[PME] Apostila - Especialização de Sargentos ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vSKwC5SZcXkH5UF15LaSs_sU-1BZNjguKNZEAMHGsYw5HDFoWWBjSpFn9xaeB-mKgngvGqEKbqHYrBk/pub?embedded=true"
        },
        esbt: {
            title: "[PME] Apostila - Especialização de Subtenentes ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vTJDFymUcWE7OwTFbykvnrLdcHIuOqLFEGRz1OeAuVcSndkhxsreMaw4jQ6o4uggBmEQA3PLl2hT-wn/pub?embedded=true"
        },
        cort: {
            title: "[PME] - Curso de Ortografia ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vSxaE1uxFMK2-I5OXarAiMboeM-QV22N6gLCrBe6oJ3D0t7CWwRAH4Nm7wm2sPQ_D8QYunGeU0hE5aW/pub?embedded=true"
        },
        cpp: {
            title: "[PME] - Curso de Planejamento Policial",
            src: "https://docs.google.com/document/d/e/2PACX-1vRbleS6nl0Jg3mbZfjdz06mqnKFO2bln1yDuCYrNOjNdEYyJGmMQKeOPOjaEBHrNyX1lmWaMDzi4DU7/pub?embedded=true"
        },
        pm: {
            title: "[PME] Protocolo Militar ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vSMN72Fax6LoYCqymhWene9wT5vmUeo_IU8tJY2yexY_3jzL-77tQqY5tGhSHE9-9iGQ9vfIijtBQWi/pub?embedded=true"
        },
        uniformes: {
            title: "[PME] Regulamento de Fardamentos ®",
            src: "https://docs.google.com/document/d/1LqlYGcE8-q6uK14pqQhZq3uZxj2e-kE3dkCjzAsoe94/edit?usp=sharing"
        }
    };

    const { userData, clearContext } = useUserContext();

    const router = useRouter();
    useEffect(() => {
        client
            .get("/users/permissions", {
                headers: { Authorization: userData?.access_token }
            })
            .catch(() => {
                toast.error(
                    "Opa! Você precisa estar logado para acessar essa página."
                );
                clearContext();
            });
    }, []);

    return (
        <>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <div
                className={
                    "flex flex-col items-center overflow-hidden max-w-[100vw] justify-center bg-[#261046] " +
                    styles.document
                }
            >
                <h1 className={styles.docTitle + " " + alata.className}>
                    {documents[params.name]?.title}
                </h1>
                <iframe
                    className={"max-w-[120%] w-[1050px] min-h-screen mt-16"}
                    src={documents[params.name]?.src}
                />
            </div>
        </>
    );
}
