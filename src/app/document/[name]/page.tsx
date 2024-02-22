import Header from "@/components/Header/Header";
import styles from "./style.module.css"
import {Alata} from "next/font/google";

const alata = Alata({subsets: ["latin"], weight: "400"})

export default function Document() {
  return (
    <div className={"flex flex-col items-center justify-center bg-[#261046] " + styles.document}>
      <Header menuState={"false"}/>
      <h1 className={styles.docTitle + " " + alata.className}>Estatuto Oficial - Polícia PME ®</h1>
      <iframe className={"max-w-full w-[1050px] min-h-screen mt-16"}
              src="https://docs.google.com/document/d/e/2PACX-1vShXNYFcre1Etp_bz_O1nzK_UrAwLTg6Fv0n4jLU1XMUjxFJrXhz5SBxLDBLN8_iBnhzq8C4S-sMexc/pub?embedded=true"
      />
    </div>
      )
}