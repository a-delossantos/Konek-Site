import React, { useEffect, useInsertionEffect, useState } from "react";
import styles from "./PostActions.module.css";
import { FaRegCommentAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { TfiComment } from "react-icons/tfi";
import {
    connectSocket,
    disconnectSocket,
    onSocketEvent,
    offSocketEvent,
    onSocketEmit,
} from "@/lib/socket";
import { Socket } from "socket.io-client";
import { number } from "zod";
import { useSession } from "next-auth/react";

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

export const PostActions = ({ post }: PostsProps) => {
    const { data: session } = useSession();
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState<number[] | undefined>(
        post.likes.map((like) => like.user.id)
    );
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        onSocketEmit("getLikes", { postId: post.id });

        onSocketEvent("likeUpdate", (data: any) => {
            if (data.postId === post.id) {
                setLikes(data.likers);
            }
        });

        return () => {
            offSocketEvent("likeUpdate", () => {
                console.log("disconnected");
            });
        };
    }, [post.id]);

    const handleLike = () => {
        onSocketEmit("likePost", { postId: post.id });
    };

    const handleDisLike = () => {
        onSocketEmit("dislikePost", { postId: post.id });
    };

    return (
        <div className={styles.actionContainer}>
            <button className={styles.comment}>
                <FaRegCommentAlt />
            </button>
            <button className={styles.like} onClick={handleLike}>
                {likes?.length != 0
                    ? likes?.includes(parseInt(session?.user.id + "")) &&
                      likes.length === 1
                        ? "You"
                        : likes?.includes(parseInt(session?.user.id + "")) &&
                          likes.length === 2
                        ? `You, ${likes.length - 1} other`
                        : likes?.includes(parseInt(session?.user.id + "")) &&
                          likes.length === 2
                        ? `You, ${likes.length - 1} others`
                        : likes?.length
                    : ""}
                {likes?.includes(parseInt(session?.user.id + "")) ? (
                    <FaHeart fill="red" />
                ) : (
                    <FaHeart />
                )}
            </button>
        </div>
    );
};
