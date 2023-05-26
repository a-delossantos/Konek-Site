import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

interface sessionData {
    user: {
        name: string;
        email: string;
        image: string;
        id: string;
        imageUrl: string;
    };
}

export async function POST(req: Request) {
    const session: sessionData | null = await getServerSession(authOptions);
    if (!session) {
        return;
    }

    const intId = parseInt(session?.user.id);

    const formData = await req.formData();
    const contentText = formData.get("content") as string;
    const file = formData.get("file");
    let imageUrl;
    if (file) {
        const imageData = new FormData();
        imageData.append("file", file);
        imageData.append("upload_preset", "my-uploads");

        const data = await fetch(
            "https://api.cloudinary.com/v1_1/dxz5v7jn3/image/upload",
            {
                method: "POST",
                body: imageData,
            }
        ).then((res) => res.json());

        if (data) {
            imageUrl = data.url;
        }
    }
    const post = await prisma.post.create({
        data: {
            imageUrl,
            content: contentText,
            authorId: intId,
        },
    });

    return new Response(JSON.stringify(post));
}
