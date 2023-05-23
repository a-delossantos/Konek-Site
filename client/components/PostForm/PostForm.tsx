"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./PostForm.module.css";
import { useSession } from "next-auth/react";
import { useGlobalContext } from "@/lib/ContextProvider";
import Link from "next/link";
import Image from "next/image";
import { BiImageAdd } from "react-icons/bi";

export const PostForm = () => {
    const { data: session } = useSession();
    const { userData, setUserData } = useGlobalContext();
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(true);
    const [textAreaValue, setTextAreaValue] = useState("");
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const [picture, setPicture] = useState("");
    const [file, setFile] = useState() as any;

    const submitPost = () => {
        if (!picture && !textAreaValue) {
            return;
        }
        const formData = new FormData();
        formData.append("content", textAreaValue);
        if (file) {
            formData.append("file", file);
        }

        const res = fetch("/api/post", {
            method: "POST",
            body: formData,
        });

        setTextAreaValue("");
        setPicture("");
    };

    const addImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            const objectURL = URL.createObjectURL(e.target.files[0]);
            setPicture(objectURL);
        }
    };

    const useAutosizeTextArea = (
        textAreaRef: HTMLTextAreaElement | null,
        value: string
    ) => {
        useEffect(() => {
            if (textAreaRef) {
                textAreaRef.style.height = "0px";
                const scrollHeight = textAreaRef.scrollHeight;
                textAreaRef.style.height = scrollHeight + "px";
            }
        }, [textAreaRef, textAreaValue]);
    };

    useAutosizeTextArea(textAreaRef.current, textAreaValue);

    const textAreaChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = evt.target?.value;
        setTextAreaValue(val);
    };

    useEffect(() => {
        fetch(`/api/user/${session?.user.id}`)
            .then((res) => res.json())
            .then((data) => {
                setUserData(data);
                setAvatar(data.imageUrl);
                setLoading(false);
            })
            .catch((error) => console.log(error));
    }, [userData]);

    return (
        <section id={styles.postForm}>
            <div className={styles.inputContainer}>
                <Image
                    alt="user-profile"
                    src={
                        loading
                            ? "https://res.cloudinary.com/dxz5v7jn3/image/upload/v1684320261/my-uploads/Spin-1s-200px_z1m8y0.gif"
                            : `${userData?.imageUrl}`
                    }
                    height={99999}
                    width={99999}
                    className={styles.profileImage}
                />
                <textarea
                    className={styles.postInput}
                    rows={1}
                    onChange={textAreaChange}
                    ref={textAreaRef}
                    value={textAreaValue}
                    placeholder={`What's on your mind ${userData?.firstName}?`}
                ></textarea>
            </div>
            {picture && (
                <div className={styles.pictureContainer}>
                    <Image
                        src={picture}
                        height={9999}
                        width={9999}
                        alt="picture"
                    />
                </div>
            )}
            <div className={styles.actionContainer}>
                <div className={styles.btnContainer}>
                    <label htmlFor="post-image" className={styles.actionBtn}>
                        <input
                            className={styles.imgUploadInput}
                            id="post-image"
                            type="file"
                            onChange={addImage}
                            name="file"
                            accept="image/png, image/gif, image/jpeg"
                        />
                        <BiImageAdd />
                    </label>
                </div>
                <div className={styles.postBtnContainer}>
                    <button className={styles.postBtn} onClick={submitPost}>
                        Post
                    </button>
                </div>
            </div>
        </section>
    );
};
