"use client";

import { error } from "console";
import React, { useEffect, useState } from "react";
import { Post } from "../Post/Post";
import styles from "./Posts.module.css";
import io from "socket.io-client";

export const Posts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const socket = io("http://localhost:8000");

        socket.on("connect", () => {
            console.log("connected");
        });
        fetch("/api/posts")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                console.log(posts);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <section className={styles.postsContainer}>
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </section>
    );
};
