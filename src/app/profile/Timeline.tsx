import {client} from "@/api/axios";

"use client"

import styles from "@/app/profile/styles.module.css";
import {Chrono} from "react-chrono";
import Image from "next/image";
import {Alata, Bayon} from "next/font/google";
import {useEffect} from "react";
import {act} from "react-dom/test-utils";
import moment from "moment";

const bayon = Bayon({ subsets: ["latin"], weight: "400" });
const alata = Alata({ subsets: ["latin"], weight: "400" });

export default function Timeline({ profile }) {

  function getTitle(activity) {
    const aux: string = activity.newRole
    console.log(aux)
    if(activity.type === "PROMOTION")
      return <h3>Promovido - {aux}</h3>
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
      <div className={styles.cape + " " + bayon.className}>
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
            {profile.ActivityLog?.map(activity => <Image height={48} className={styles.tlIcon} width={48} src="https://i.imgur.com/gcniOkp.png" alt="image1"/>)}

          </div>
        </Chrono>
      </div>
    </div>
  )
}