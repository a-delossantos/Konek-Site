import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface sessionData {
    user : {
        name: string,
        email: string,
        image: string,
        id: string,
        imageUrl: string,
    }
}

export async function GET(req:NextRequest) {
    const session: sessionData | null = await getServerSession(authOptions)
    if (!session) {
        return new Response(JSON.stringify('Invalid credentials'), {status: 400})
    }

    const posts = await prisma.post.findMany({
        where: {
            authorId: parseInt(session.user.id)
        },
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            author: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                    imageUrl: true
                }
            }
        }
    })
    if (posts) {
        return new Response(JSON.stringify(posts))
    }
}