import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
// auth.config imporrt object
import authConfig from "@/libs/auth.config"
import{db} from "@/libs/db"
 
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {strategy: "jwt",},
  ...authConfig,
  callbacks:{
    jwt({token,user}){
      if(user){
        token.role = user.role
      }
      return token
    },
    session({session,token}){
      if(session.user){
        session.user.role = token.role
      }
      return session
    }
  }
})