"use client";

import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { Prompt } from "next/font/google";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const prompt = Prompt({ weight: "700", subsets: ["latin"] });

type FormData = {
    email: string;
    password: string;
};

export const LoginForm = () => {
    const router = useRouter();
    const [loginerror, setLoginerror] = useState("");
    const { data: session } = useSession();

    const schema: ZodType<FormData> = z.object({
        email: z
            .string()
            .nonempty({ message: "Please enter your email address" })
            .email(),
        password: z
            .string()
            .min(5, { message: "Password must be 5-20 characters" })
            .max(20, { message: "Password must be 5-20 characters" }),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const loginHandler = async (data: FormData) => {
        const res = await signIn("credentials", {
            username: data.email,
            password: data.password,
            callbackUrl: "/",
            redirect: false,
        });

        if (res?.error) {
            setLoginerror("Invalid");
            return;
        }

        router.push("/");
    };

    return (
        <>
            <div className={styles["form-logo"]}>
                <h1 className={prompt.className}>Konek</h1>
                <p>Konek, Share, Thrive.</p>
            </div>
            <div className={styles["form-holder"]}>
                <p>Welcome to Konek</p>
                {loginerror && <span>{loginerror}</span>}
                <form onSubmit={handleSubmit(loginHandler)}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" {...register("email")} />
                    {errors.email && <span>{errors.email.message}</span>}
                    <label htmlFor="password">Password:</label>
                    <input type="password" {...register("password")} />
                    {errors.password && <span>{errors.password.message}</span>}
                    <button className="btn" type="submit">
                        Login
                    </button>
                </form>
            </div>
            <p>
                Don't have an account?{" "}
                <Link href={"/register"}>Create an account</Link>
            </p>
        </>
    );
};
