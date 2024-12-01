import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/libs/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const especialidades = await db.professional.findMany({
        select: {
          id: true,
          specialty: true,
          User: {
            select: { name: true, email: true },
          },
        },
      });

      res.status(200).json(especialidades);
    } catch (error) {
      console.error("Error al obtener especialidades:", error);
      res.status(500).json({ error: "Error al obtener especialidades" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
