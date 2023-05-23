import styles from "./page.module.css";
import Image from "next/image";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { PostForm } from "@/components/PostForm/PostForm";
import { Posts } from "@/components/Posts/Posts";

export default async function Home() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/login");
    }
    return (
        <section id={styles["homepage"]}>
            <PostForm />
            <Posts />
        </section>
    );
}
