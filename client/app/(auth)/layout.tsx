import styles from "./page.module.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={styles["authentication"]}>
            <section className={styles["form-section"]}>
                <div className={styles["container"]}>
                    <div className={styles["form-container"]}>{children}</div>
                    <div className={styles["form-image"]}></div>
                </div>
            </section>
        </div>
    );
}
