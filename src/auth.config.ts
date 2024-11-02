import type { NextAuthConfig } from "next-auth"
import Credentials  from "next-auth/providers/credentials" 
import { LoginPacienteSchema } from "./libs/zod"
import { db } from "./libs/db"
import bcrypt from "bcryptjs"

// Notice this is only an object, not a full Auth.js instance
export default {
    providers: [
        Credentials({
          authorize: async (credentials) => {
            
            // Add logic here to look up the user from the credentials
            const {data,success} = LoginPacienteSchema.safeParse(credentials) 

            // if the user is not found or the password is incorrect
            if(!success){
              throw new Error("Invalid credentials")
            }

            // If the user exists and the password is correct
            const user = await db.user.findUnique({
                where: {
                    email: data.email
                }
            })

            if (!user) {
              throw new Error("No user found")
            }

            // Compare the password from the form to the password in the database
            const passwordMatch = await bcrypt.compare(data.password, user.password)

            if (!passwordMatch) {
              throw new Error("Invalid password")
            }


            // return user object with their profile data
            return user
          },
        }),
      ],
} satisfies NextAuthConfig
