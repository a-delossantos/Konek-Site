import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { POST } from "../../login/route";
import { NextAuthOptions } from "next-auth";
import { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";
import { unknown } from "zod";


export const authOptions: NextAuthOptions = ({
    session : {
      strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
          name: "Credentials",
          credentials: {
            username: { label: "Username", type: "text", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {

            if (!credentials?.username || !credentials.password) {
              return null
            }


            const user = await prisma.user.findUnique({
              where: {
                email: credentials.username
              }
            })


            if (!user) {
              return null
            }
            
            const isPasswordValid = await compare(
              credentials.password,
              user.password
            )

            if (!isPasswordValid) {
              return null
            }

            return {
              id: user.id + '',
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              imageUrl: user.imageUrl
            }


          }
        })
      ],
      callbacks: {
        async jwt({ token, user }) {
          if (user) {
            const u = user as unknown as User
            return {
              ...token,
              id: u.id,
              imageUrl: u.imageUrl
            }
          }
          return token
        },
    
        async session({ session, token }) {
          return {
            ...session,
            user: {
              ...session.user,
              id: token.id,
              imageUrl: token.imageUrl
            }
          }
        },
      },
      pages: {
        signIn: '/',
      }
})

const handler = NextAuth(authOptions)
export {handler as GET, handler as POST}


