import styles from "./styles.module.css";
import { useRouter } from "next/navigation";

export default function NotFound({ nick, options }) {
    const router = useRouter();
    return (
        <main className={styles.notFound}>
            <div className={styles.notFoundTitle}>
                <h2>Não encontramos o "{nick}"</h2>
                <h2>Por acaso seria algum desses?</h2>
            </div>
            <div className={styles.notFoundOption}>
                <h2>Nick</h2>
                <h2>Situação</h2>
            </div>
            {options.map((option) => (
                <div
                    onClick={() =>
                        router.replace("/profile?nick=" + option.nick)
                    }
                    className={styles.notFoundOption}
                >
                    <h2>{option.nick}</h2>
                    <h2>{option.isAccountActive ? "ATIVO" : "INATIVO"}</h2>
                </div>
            ))}
        </main>
    );
}
