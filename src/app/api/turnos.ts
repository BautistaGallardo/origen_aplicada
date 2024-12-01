import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/libs/db"; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const turnos = await db.appointment.findMany({
        include: {
          Professional: {
            select: {
              User: { select: { name: true, email: true } },
            },
          },
          Patient: {
            select: {
              User: { select: { name: true } },
            },
          },
        },
      });

      res.status(200).json(turnos);
    } catch (error) {
      console.error("Error al obtener turnos:", error);
      res.status(500).json({ error: "Error al obtener turnos" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
