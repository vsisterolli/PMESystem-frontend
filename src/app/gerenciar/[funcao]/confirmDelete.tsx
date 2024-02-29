import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import {catchErrorMessage, client} from "@/api/axios";
import { toast } from "react-toastify";
import { useUserContext } from "@/app/Context/context";

let timer;

export default function ConfirmDelete({ visibilityState, departament, futureDeleted }) {
  const [visibility, setVisibility] = visibilityState;
  const { userData } = useUserContext();

  async function sendDeletion() {
    client.delete(`/departaments/user?departament=${departament.toUpperCase()}&userNick=${futureDeleted}`, {headers: {Authorization: userData?.access_token}})
      .then(() => {
        toast.success(`${futureDeleted} foi removido da função.`);
        setVisibility("hidden");
      }).catch(e => catchErrorMessage(e));
  }
  return (
    <div
      className={styles.popOuter + " max-w-screen " + visibility}
      onClick={() => setVisibility("hidden")}
    >
      <div
        className={styles.popInside}
        onClick={(event) => event.stopPropagation()}
      >
        <h1 className={"mb-8"}>REMOVER MEMBRO</h1>
        <h3 className={"max-w-[80%] text-center"}>Tem certeza que deseja remover o/a {futureDeleted} do departamento?</h3>

        <div className={styles.deleteButtons}>
          <button onClick={sendDeletion} className={styles.confirmButton}>CONFIRMAR</button>
          <button onClick={() => setVisibility("hidden")} className={styles.denyButton}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
}
