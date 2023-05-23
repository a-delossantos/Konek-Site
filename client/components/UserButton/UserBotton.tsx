"use client";

import React, { useEffect, useState } from "react";
import styles from "./UserBotton.module.css";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useGlobalContext } from "@/lib/ContextProvider";
import { BiImageAdd } from "react-icons/bi";

export const UserBotton = () => {
    const { data: session } = useSession();
    const { userData, setUserData } = useGlobalContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/user/${session?.user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setUserData(data);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [session]);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true);
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "my-uploads");
            const data = await fetch("/api/user//upload/image", {
                method: "POST",
                body: formData,
            })
                .then((r) => r.json())
                .then((data) => {
                    setUserData((prev) => ({
                        ...prev,
                        imageUrl: data.imageUrl,
                    }));
                    setLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    return (
        <>
            <div className={styles["user"]}>
                <Image
                    alt="user-profile"
                    src={
                        loading || userData?.imageUrl === undefined
                            ? "https://res.cloudinary.com/dxz5v7jn3/image/upload/v1684320261/my-uploads/Spin-1s-200px_z1m8y0.gif"
                            : `${userData?.imageUrl}`
                    }
                    height={99999}
                    width={99999}
                    className={styles["profile-image"]}
                />
                <div className={styles["user-dropdown"]}>
                    <div className={styles["user-container"]}>
                        <div className={styles["img-container"]}>
                            <Image
                                alt="user-profile"
                                src={
                                    loading || userData?.imageUrl === undefined
                                        ? "https://res.cloudinary.com/dxz5v7jn3/image/upload/v1684320261/my-uploads/Spin-1s-200px_z1m8y0.gif"
                                        : `${userData?.imageUrl}`
                                }
                                height={99999}
                                width={99999}
                                className={styles["profile-image"]}
                            />
                            {!loading && (
                                <label
                                    htmlFor="image-upload"
                                    className={styles["img-button"]}
                                >
                                    <input
                                        id="image-upload"
                                        type="file"
                                        onChange={uploadImage}
                                        name="file"
                                        accept="image/png, image/gif, image/jpeg"
                                    />
                                    <BiImageAdd />
                                </label>
                            )}
                        </div>

                        <p>{session?.user.email}</p>
                        <div>
                            <Link href={"/"} className={styles["btn"]}>
                                Profile
                            </Link>{" "}
                            |{" "}
                            <button
                                onClick={() => signOut()}
                                className={styles["btn"]}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
