"use client";

import { error } from "console";
import React, { useEffect, useState } from "react";
import { Post } from "../Post/Post";
import styles from "./Posts.module.css";
import io from "socket.io-client";
import {
    connectSocket,
    disconnectSocket,
    onSocketEvent,
    offSocketEvent,
} from "@/lib/socket";
import { useSession } from "next-auth/react";

export const Posts = () => {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (!session) {
            return;
        }

        connectSocket(session?.user.id + "");
        onSocketEvent("connect", () => {
            console.log("connected");
        });

        onSocketEvent("initialPost", (initialPost: any) => {
            setPosts(initialPost);
            console.log("initial", posts);
        });

        onSocketEvent("newPost", (data: any) => {
            console.log("recieved", data);
            setPosts((prevPost) => [data, ...prevPost] as any);
            console.log("post", posts);
        });

        return () => {
            disconnectSocket();
            offSocketEvent("connect", () => {
                console.log("disconnected");
            });
        };
    }, [session]);

    return (
        <section className={styles.postsContainer}>
            {posts.map((post, index) => (
                <Post key={index} post={post} />
            ))}
        </section>
    );
};
