import React, {useState, useEffect} from "react";
import { useSession } from "next-auth/react";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
  } from "@/components/ui/table";

  


  
  const TurnoTable = () => {
     
  
      return (
          <Table className="w-full">
              <TableHeader>
                  <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Paciente</TableHead>
                      <TableHead>Numero de Telefono</TableHead>
                      <TableHead>Atención</TableHead>
                      <TableHead>Acciones</TableHead>
                  </TableRow>
              </TableHeader>
              <TableBody>
                
              </TableBody>
          </Table>
      );
  };
  
  export default TurnoTable;
  