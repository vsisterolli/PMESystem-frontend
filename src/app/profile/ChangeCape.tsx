import styles from "./styles.module.css";
import {useEffect, useState} from "react";
import {client} from "@/api/axios";
import {toast} from "react-toastify";

let timer;

export default function ChangeCape({ capeSelected, visibilityState }) {

  const [capes, setCapes] = useState([]);
  const [visibility, setVisibility] = visibilityState;
  const userData = JSON.parse(localStorage.getItem("userData"))
  const [chosen, setChosen] = useState(userData.userData.capeSelected)
  const baseS3 = "https://pmesystem.s3.sa-east-1.amazonaws.com/";
  const [newCapeSelected, setNewCapeSelected] = capeSelected;

  async function changeCape(option) {
    setNewCapeSelected(!newCapeSelected);
    await client.patch("/cosmetic/userCape/", {userNick: userData.userData.nick, capeName: option}, {headers: {"Authorization": userData.access_token}});
    toast.success("Capa trocada com sucesso!")
  }

  const debounce = (option) => {
    setChosen(option);
    clearTimeout(timer);
    timer = setTimeout(() => changeCape(option), 1500);
  };

  useEffect(() => {
    client.get("/cosmetic/capes", { headers: {"Authorization": userData.access_token}})
      .then(response => setCapes(response.data))
  }, []);

  return (
    <div className={styles.popOuter + " max-w-screen " + visibility} onClick={() => setVisibility("hidden")}>
      <div className={styles.popInside} onClick={(event) => event.stopPropagation()}>
        <h3>MINHAS CAPAS</h3>
        <div onClick={() => debounce("base.png")} className={styles.capeOption}>
          <input type="checkbox" checked={("base.png" === chosen)}  className={styles.checkboxRound}/>
          <div className={styles.changeCapeOption + " bg-[url('/base.png')]"}></div>
        </div>
        <h3>Capa padrão</h3>
        {capes.map(option =>
          <>
            <div onClick={() => debounce(option.fileName)} className={styles.capeOption}>
              <input type="checkbox" checked={(option.fileName === chosen)} className={styles.checkboxRound}/>
              <div
                style={{ backgroundImage: `url(${baseS3 + option.fileName})` }}
                className={styles.changeCapeOption}></div>
            </div>
            <h3>{option.name}</h3>
          </>
        )}
      </div>
    </div>
  )
}