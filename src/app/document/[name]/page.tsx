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
    const [documents, setDocuments] = useState({
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
        uniforme: {
            title: "[PME] Identificação Militar ®",
            src: "https://docs.google.com/document/d/e/2PACX-1vTCTFMqXzLanK0djKTR0XAlpup0VcAaNdDOyjLwcbtaadn_5agOGubXw_2hE6i4_KmfgRmkplSHlt-i/pub?embedded=true"
        },
        cfpe: {
            title: "[PME] Curso de Formação Policial Executiva ®",
            src: `https://docs.google.com/presentation/d/e/2PACX-1vSygJ6YVbrynTQqEzdnI6avEHk44OuMKw2rQ8lqNeGknYclva5c1p4XCAS1p9S7yGy3KYTqfeS97J_f/embed?start=false&loop=true&delayms=3000`,
            type: "slide"
        },
        cfc: {
            title: "[PME] Curso de Formação Complementar ®",
            src: `https://docs.google.com/presentation/d/e/2PACX-1vReZ6rbHcqppvKrWxSlMEcG-KYk4RV64fwa1FFozDd4kSe660czbku8yR1CfTc41Bilh4K-2dqwgIi_/embed?start=false&loop=false&delayms=3000`,
            type: "slide"
        },
        capex: {
            title: "[PME] Curso de Aprimoramento Executivo ®",
            src: `https://docs.google.com/presentation/d/e/2PACX-1vT0Cv1fDH3u7x6MFytCRZfkPi6Oarc2Z5p66-gUZ71y9805GOiJP0cbmNPsPT3DMvMfPMdx5Seq3OWQ/embed?start=false&loop=false&delayms=3000`,
            type: "slide"
        }
    });

    const { userData, clearContext } = useUserContext();

    const router = useRouter();
    useEffect(() => {
        client
          .get("/users/self", {headers: {Authorization: userData.access_token}})
          .then((response) => {
              if(response.data?.role.hierarchyPosition >= 5)
                  setDocuments({...documents,
                  m1teorico: {
                      src: "https://docs.google.com/document/d/e/2PACX-1vS7hpvpOH2Ew-gyXPIqJeaGLAJeeOD-56YRb2Eut2QVIjVkl3CPaJ059CmF8hg01e4FU-aElWqSUcrk/pub?embedded=true",
                      title: "[PME] CFO - Apostila Módulo I ®"
                  },
                  m1pratico: {
                      src: "https://docs.google.com/document/d/e/2PACX-1vT3pToarL8g3VzligDRmlRAd2L1Fntm2MYyR6R42vyO1nilduVmH0fvbPNg58FEarZgKVzneB1bYb8P/pub?embedded=true",
                      title: "[PME] CFO - Avaliação I ®"
                  },
                  m2teorico: {
                      src: "https://docs.google.com/document/d/e/2PACX-1vRpT7Axubn7PB3msnx5LD1prYYjkJCwNefoKduXRyPiJPWukPjhgjXjtsPE8Dvmj2I3Dm6g96Om-psv/pub?embedded=true",
                      title: "[PME] CFO - Apostila Módulo II ®"
                  },
                  m2pratico: {
                      src: "https://docs.google.com/document/d/e/2PACX-1vRyRafxvGAAZF8lDj3C6LvCihODMy8L5KV1xqn1iRRwbSqDPNtAQ27jDmCni646eR9agc4Cq_zUBEo3/pub?embedded=true",
                      title: "[PME] CFO - Avaliação II ®"
                  },
                  cfoinicial: {
                      src: "https://docs.google.com/document/d/e/2PACX-1vQHn1wbX4HejKOhiKqy_JDym0RbbX7LzDYSmADgwZqhRFYHrK1M7SwbGWqLNrps2hv8GzNlHt2k96OM/pub?embedded=true",
                      title: "[PME] CFO - Instruções Iniciais"
                  }
                })
          })
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
                  className={(documents[params.name]?.type !== "slide" ? "max-w-[120%] w-[1050px] min-h-screen mt-16" : "min-h-[80vh] w-[90vw] mt-16 mb-16")}
                  src={documents[params.name]?.src}
                  allowFullScreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"
                />
            </div>
        </>
    );
}
