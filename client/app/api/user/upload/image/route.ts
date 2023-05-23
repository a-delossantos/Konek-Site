import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from 'next/server'
import { string } from "zod";


interface sessionData {
    user : {
        name: string,
        email: string,
        image: string,
        id: string,
        imageUrl: string,
    }
}

export async function POST(req:Request) {
    const session: sessionData | null = await getServerSession(authOptions)

    if (!session) {
        return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
          status: 401
        })
    }
    
    const formData = await req.formData()
    const data = await fetch('https://api.cloudinary.com/v1_1/dxz5v7jn3/image/upload', {
        method: "POST",
        body: formData,
    })
        .then((r) => r.json())
        .catch((error) => {
            console.log(error);
        });

    if (data) { 
        const intId = parseInt(session.user.id, 10)
        const userUpdateImage = await prisma.user.update({
            where: {
                id: intId,
            },
            data: {
                imageUrl: data.url
            }
        })
        console.log('test')
        return new NextResponse(JSON.stringify({imageUrl: userUpdateImage.imageUrl}))
    }  
    
}