'use client'

import { useSession } from "next-auth/react";

export default function SaveSession() {
    const session = useSession()

    const saveRoleSession = session.data?.user.role
    console.log(saveRoleSession)
    
    return saveRoleSession
}
