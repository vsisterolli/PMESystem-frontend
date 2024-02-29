"use client";

import Header from "@/components/Header/Header";
import styles from "./style.module.css";
import { Alata } from "next/font/google";
import { catchErrorMessage, client } from "@/api/axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Menu from "@/components/Menu/Menu";
import { useUserContext } from "@/app/Context/context";

const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Script({ params }) {
    const menuState = useState("hidden");
    const { userData, clearContext } = useUserContext();
    const [courseObject, setCourseObject] = useState({
        document: "",
        name: "",
        acronym: ""
    });

    const router = useRouter();
    useEffect(() => {
        client
            .get("/departaments/course/" + params.course, {
                headers: { Authorization: userData?.access_token }
            })
            .then((response) => setCourseObject(response.data))
            .catch((e) => {
                console.log("Shauidhiuahduiahsi");
                router.replace("/home");
                catchErrorMessage(e);
            });
    }, [params.course]);

    return (
        <>
            <Header menuState={menuState} />
            <Menu menuState={menuState} />
            <div
                className={
                    "flex flex-col items-center justify-center bg-[#261046] " +
                    styles.document
                }
            >
                <h1 className={styles.docTitle + " " + alata.className}>
                    {courseObject.acronym} - {courseObject.name}
                </h1>
                <iframe
                    className={"max-w-full w-[1050px] min-h-screen mt-16"}
                    src={courseObject.document}
                />
            </div>
        </>
    );
}
