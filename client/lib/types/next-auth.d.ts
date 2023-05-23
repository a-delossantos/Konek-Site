import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
        // imageUrl?: String,
        // firstName?: String,
        // lastName?: String,
        id: number
    } & DefaultSession["user"]
  }
}