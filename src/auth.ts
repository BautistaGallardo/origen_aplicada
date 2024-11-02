import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
// auth.config imporrt object
import authConfig from "@/auth.config"
import{db} from "@/libs/db"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt"},
  ...authConfig,
})