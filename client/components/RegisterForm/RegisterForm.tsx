"use client";
import React from "react";
import { Prompt } from "next/font/google";
import styles from "./RegisterForm.module.css";
import Link from "next/link";
import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type FormData = {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    gender: string;
};

const prompt = Prompt({ weight: "600", subsets: ["latin"] });

export const RegisterForm = () => {
    const router = useRouter();
    const schema: ZodType<FormData> = z
        .object({
            email: z.string().email(),
            firstName: z.string().min(2).max(20),
            lastName: z.string().min(2).max(20),
            password: z.string().min(5).max(20),
            confirmPassword: z.string().min(5).max(20),
            gender: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Password do not match",
            path: ["confirmPassword"],
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const submit = async (data: FormData) => {
        await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                gender: data.gender,
                password: data.password,
            }),
        }).then((response) => {
            // Check if the response is successful (status code in the range 200-299)
            if (response.ok) {
                // window.location.href = response.url;
                router.push("/login");
            } else {
                throw new Error("Something went wrong");
            }
        });
    };

    return (
        <>
            <div className={styles["register"]}>
                <div>
                    <h1 className={prompt.className}>Create an Account</h1>
                    <p>Register and start Konek-ting with others.</p>
                </div>
                <div className={styles["form-holder"]}>
                    <form onSubmit={handleSubmit(submit)}>
                        <div className={styles["name-input"]}>
                            <label htmlFor="firstName">First Name:</label>
                            <input
                                type="firstName"
                                {...register("firstName")}
                            />
                            {errors.firstName && (
                                <span>{errors.firstName.message}</span>
                            )}
                            <label htmlFor="lastName">Last Name:</label>
                            <input type="lastName" {...register("lastName")} />
                            {errors.lastName && (
                                <span>{errors.lastName.message}</span>
                            )}
                        </div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" {...register("email")} />
                        {errors.email && <span>{errors.email.message}</span>}
                        <label htmlFor="password">Password:</label>
                        <input type="password" {...register("password")} />
                        {errors.password && (
                            <span>{errors.password.message}</span>
                        )}
                        <label htmlFor="confirmPassword">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span>{errors.confirmPassword.message}</span>
                        )}
                        <label htmlFor="gender">Gender:</label>
                        <div className={styles["select-wrapper"]}>
                            <select {...register("gender")}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button className="btn" type="submit">
                            Register
                        </button>
                    </form>
                </div>
                <p className={styles["login-link"]}>
                    Already have an account?{" "}
                    <Link href={"/login"}>Login now.</Link>
                </p>
            </div>
        </>
    );
};
