import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Post.module.css";
import { PostActions } from "../PostActions/PostActions";
import { json } from "stream/consumers";

interface AuthorProps {
    imageUrl: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface LikeProps {
    user: UserProps;
}

interface UserProps {
    id: number;
}

interface PostProps {
    id: number;
    createdAt: string;
    imageUrl: string;
    content: string;
    author: AuthorProps;
    likes: LikeProps[];
}
interface PostsProps {
    post: PostProps;
}

export const Post = (post: PostsProps) => {
    const [postDate, setPostData] = useState(getTimeAgo(post.post.createdAt));

    function getTimeAgo(timestamp: string) {
        const currentDate = new Date();
        const pastDate = new Date(timestamp);
        const timeDifference = currentDate.getTime() - pastDate.getTime();
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (weeks > 0) {
            return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
        } else if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        } else {
            return `Just now`;
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            // Code to execute after the timeout
            setPostData(getTimeAgo(post.post.createdAt));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [postDate]);

    return (
        <div className={styles.postContainer}>
            <div className={styles.postInfo}>
                <div>
                    <Image
                        src={post.post.author.imageUrl}
                        width={100}
                        height={100}
                        alt={`${post.post.author}-profile`}
                        className={styles.profileImage}
                    />
                </div>
                <div>
                    <p className={styles.author}>
                        {post.post.author.firstName} {post.post.author.lastName}
                    </p>
                    <p className={styles.postDate}>{postDate}</p>
                </div>
            </div>
            <div className={styles.postContent}>
                <p>{post.post.content}</p>
                {post.post.imageUrl && (
                    <Image
                        src={post.post.imageUrl}
                        width={9999}
                        height={9999}
                        alt={`${post.post.id}-image`}
                        className={styles.contentImage}
                    />
                )}
            </div>
            <PostActions key={post.post.id} post={post.post} />
        </div>
    );
};
