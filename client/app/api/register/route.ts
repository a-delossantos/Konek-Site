import prisma from "@/lib/prisma"
import * as bcrypt from 'bcrypt'


interface RequestBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    gender: string,
    imageUrl: string
}


export async function POST(req:Request) {
    const body:RequestBody = await req.json()
    

    const user = await prisma.user.create({
        data: {
            firstName: body.firstName,
            email: body.email,
            lastName: body.lastName,
            gender: body.gender,
            password: await bcrypt.hash(body.password, 10),
            imageUrl: `/user-${body.gender.toLowerCase()}.png`
        }
    })


    const {password, ...newUser} = user
    // return new Response(JSON.stringify(newUser))
    return Response.redirect('http://localhost:3000/login')
}