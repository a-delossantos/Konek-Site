import express, { Express, Request, Response } from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { parse } from "path";
import { emit } from "process";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const prisma = new PrismaClient();

app.use(cors());

io.on("connection", async (socket) => {
    const userId = socket.handshake.query.userId as string;
    const socketId = await prisma.user.update({
        where: {
            id: parseInt(userId),
        },
        data: {
            socketId: socket.id,
        },
    });
    const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        include: {
            posts: {
                orderBy: { createdAt: "asc" },
                include: {
                    author: true,
                    likes: {
                        include: {
                            user: true,
                        },
                    },
                },
            },
            friends: {
                include: {
                    friend: {
                        include: {
                            posts: {
                                orderBy: { createdAt: "asc" },
                                include: {
                                    author: true,
                                    likes: {
                                        include: {
                                            user: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    const ownPosts = user?.posts;
    const friendpost = user?.friends.flatMap((friend) => friend.friend.posts);
    const getInitialPost = () => {
        if (friendpost) {
            const allpost = ownPosts?.concat(friendpost);
            const initialPost = allpost?.sort(
                (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
            );
            return initialPost;
        }
    };
    const initialPost = getInitialPost();
    io.to(socket.id).emit("initialPost", initialPost);
    //Connect Event - End

    socket.on("disconnect", async () => {
        await prisma.user.update({
            where: {
                id: parseInt(userId),
            },
            data: {
                socketId: null,
            },
        });
    });

    //Create Post Event - Start
    socket.on("createPost", async (data) => {
        const content = data.content;
        const imageUrl = data.imageUrl || null;

        const post = await prisma.post.create({
            data: {
                content: content,
                imageUrl: imageUrl,
                authorId: parseInt(userId),
            },
            include: {
                author: {
                    include: {
                        friends: {
                            include: {
                                friend: true,
                            },
                            where: {
                                friend: { socketId: { not: null } },
                            },
                        },
                    },
                },
                likes: {
                    include: {
                        user: true,
                    },
                },
            },
        });
        const emitNewPost = () => {
            const friends = post.author.friends.flatMap(
                (friend) => friend.friend.socketId!
            );
            friends.push(socket.id);

            friends.forEach((socketid) => {
                io.to(socketid).emit("newPost", post);
            });
        };
        emitNewPost();
    });
    //Create Post Event - End

    // Post Get Like Event - Start

    socket.on("getLikes", async (data) => {
        const postId = data.postId;

        const likes = await prisma.like.findMany({
            where: {
                postId: postId,
            },
            select: {
                userId: true,
            },
        });
        const postLike = await prisma.like.findMany({
            where: {
                postId: postId,
            },
            select: {
                userId: true,
            },
        });

        if (postLike) {
            const postLikers = postLike.map((like) => like.userId);
            io.emit("likeUpdate", {
                likers: postLikers,
                postId: postId,
            });
        }
    });

    // Post Like Event - Start
    socket.on("likePost", async (data) => {
        const postId = data.postId;

        const likePost = await prisma.like.create({
            data: {
                userId: parseInt(userId),
                postId: postId,
            },
        });

        const postLike = await prisma.like.findMany({
            where: {
                postId: postId,
            },
            select: {
                userId: true,
            },
        });

        if (postLike) {
            const postLikers = postLike.map((like) => like.userId);
            io.emit("likeUpdate", {
                likers: postLikers,
                postId: postId,
            });
        }
    });
});

const port = 3001;

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
