import {client} from "@/api/axios";

"use client"

import styles from "@/app/profile/styles.module.css";
import {Chrono} from "react-chrono";
import Image from "next/image";
import {Alata, Bayon} from "next/font/google";
import {useEffect, useState} from "react";
import {act} from "react-dom/test-utils";
import moment from "moment";
import ChangeCape from "@/app/profile/ChangeCape";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Timeline({ profile, capeSelected }) {

  let userData
  if (typeof window !== 'undefined') {
    userData = JSON.parse(localStorage.getItem("userData")).userData;
  }
  const visibilityState = useState("hidden");
  const baseS3 = "https://pmesystem.s3.sa-east-1.amazonaws.com/";
  const [, setVisibility] = visibilityState;
  {console.log(userData)}

  const icons = {
    "PROMOTION": "https://pmesystem.s3.sa-east-1.amazonaws.com/x1.png",
    "DEMOTION": "https://pmesystem.s3.sa-east-1.amazonaws.com/x2.png",
    "FIRE": "https://pmesystem.s3.sa-east-1.amazonaws.com/x3.png",
    "WARNING": "https://pmesystem.s3.sa-east-1.amazonaws.com/x4.png",
    "COURSE": "https://pmesystem.s3.sa-east-1.amazonaws.com/kindpng_298871-removebg-preview-removebg-preview.png",
    "SELLING": "https://pmesystem.s3.sa-east-1.amazonaws.com/toppng.com-download-handshake-icon-gree-600x600.png",
    "CONTRACTING": "https://pmesystem.s3.sa-east-1.amazonaws.com/toppng.com-download-handshake-icon-gree-600x600.png"
  }

  function getTitle(activity) {
    const aux: string = activity.newRole
    if(activity.type === "PROMOTION")
      return <h3>Promovido - {aux}</h3>
    if(activity.type === "SELLING")
      return <h3>Venda de Cargo - {aux}</h3>
    if(activity.type === "CONTRACTING")
      return <h3>Contratado - {aux}</h3>
    if(activity.type === "DEMOTION")
      return <h3>Rebaixado - {aux}</h3>
    if(activity.type === "FIRE")
      return <h3>Demitido</h3>
    if(activity.type === "WARNING")
      return <h3>Advertência ({activity.isActive ? "ATIVA" : "INATIVA"})</h3>
  }

  function getPermissions() {
    if(profile.permissionsObtained?.length === 0)
      return "";

    let str = "[";
    profile.permissionsObtained?.forEach(((permission, index) => {
      str = str.concat(permission.name);
      if(index !== profile.permissionsObtained.length - 1)
        str = str.concat("/");
    }));
    str = str.concat("]")

    return str;
  }

  return (
    <div className={styles.content}>
      <ChangeCape capeSelected={capeSelected} visibilityState={visibilityState}/>
      <div
        style={{backgroundImage: `url(${baseS3 + profile.capeSelected})`}}
        className={styles.cape + " " + bayon.className}>
        { (userData.nick === profile.nick) && <Image src={"https://pmesystem.s3.sa-east-1.amazonaws.com/pencil-removebg-preview.png"} onClick={() => setVisibility("inherit")} width={50} height={50} alt={"lápis de edição"}/>}
        <div>
          [PME] {profile.roleName} {getPermissions()}
        </div>
      </div>
      <div className={styles.timeline + " flex flex-col items-center justify-center"}>
        <Chrono mode="VERTICAL_ALTERNATING" hideControls
                scrollable={{scrollbar: false}}
                theme={{
                  cardBgColor: "#3B2063",
                }}
                allowDynamicUpdate={true}
                items={profile.ActivityLog}
        >
          {profile.ActivityLog?.map(activity =>
            <div>
              <div className={styles.card + " " + alata.className}>
                {getTitle(activity)}
                <h4>{moment(activity.createdAt).format("DD/MM/yyyy - HH:mm")}</h4>
                <p>
                  {activity.description}
                </p>
              </div>
              <div className={styles.appliedBy}>
                Aplicado por {activity.author}
              </div>
            </div>
          )}

          <div className="chrono-icons">
            {profile.ActivityLog?.map(activity => <Image height={48} className={styles.tlIcon} width={48} src={icons[activity.type]} alt="image1"/>)}

          </div>
        </Chrono>
      </div>
    </div>
  )
}