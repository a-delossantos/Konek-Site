import prisma from "@/lib/prisma";

export async function GET(req:Request) {
    const id = req.url.slice(req.url.lastIndexOf('/') + 1)
    const intid = parseInt(id, 10)

    if (isNaN(intid)) {
        return new Response(JSON.stringify(null))
    } else {
        const user = await prisma.user.findUnique({
            where: {
                id: intid
            }
        })
        if (user) {
            const {password, ...userData} = user
            return new Response(JSON.stringify(userData))
        } else {
            return new Response(JSON.stringify(null))
        }
    }    
}