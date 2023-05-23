import React from "react";
import styles from "./HeaderNav.module.css";
import { UserBotton } from "../UserButton/UserBotton";

export const HeaderNav = () => {
    return (
        <nav id={styles["header-nav"]}>
            <div className={styles["header-logo"]}>
                <h1>Konek</h1>
            </div>
            <div>
                <UserBotton />
            </div>
        </nav>
    );
};
