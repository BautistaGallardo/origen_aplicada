import { db } from "@/libs/db";
import { NextResponse, NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id || !body.action || !body.role) {
            return NextResponse.json(
                { error: "Request body must contain 'id', 'action', and 'role'" },
                { status: 400 }
            );
        }

        const { id, action, role } = body;
        const validActions = ["activate", "deactivate"];
        const validRoles = ["patient", "professional"];

        if (!validActions.includes(action) || !validRoles.includes(role)) {
            return NextResponse.json(
                { error: "Invalid action or role specified" },
                { status: 400 }
            );
        }

        const user = await db.user.findUnique({
            where: { id },
            select: {
                id: true,
                patient: true,
                professional: true,
                state: true,
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        const updateState = action === "activate";

        if (role === "patient" && user.patient !== null) {
            // Actualizar el rol de paciente
            await db.patients.update({
                where: { userId: user.id },
                data: { state: updateState },
            });

            if (!updateState) {
                // Actualizar reservaciones pendientes a canceladas
                const pendingReservations = await db.reservation.findMany({
                    where: {
                        patient_id: user.patient.id,
                        state: "pendiente",
                    },
                    include: { Appointment: true },
                });

                await Promise.all(
                    pendingReservations.map(async (reservation) => {
                        // Cambiar el estado de la reservación
                        await db.reservation.update({
                            where: {
                                appointment_id_patient_id: {
                                    appointment_id: reservation.appointment_id,
                                    patient_id: reservation.patient_id,
                                },
                            },
                            data: { state: "cancelada" },
                        });

                        // Cambiar el estado del turno a "disponible" si no tiene otras reservaciones pendientes
                        const remainingReservations = await db.reservation.count({
                            where: {
                                appointment_id: reservation.appointment_id,
                                state: "pendiente",
                            },
                        });

                        if (remainingReservations === 0) {
                            await db.appointment.update({
                                where: { id: reservation.appointment_id },
                                data: { state: "disponible" },
                            });
                        }
                    })
                );
            }

            if (updateState && !user.professional) {
                await db.user.update({
                    where: { id: user.id },
                    data: { state: true },
                });
            }

            if (!updateState && !user.professional) {
                await db.user.update({
                    where: { id: user.id },
                    data: { state: false },
                });
            }
        } else if (role === "professional" && user.professional !== null) {
            // Actualizar el rol de profesional
            await db.professional.update({
                where: { userId: user.id },
                data: { state: updateState },
            });

            if (!updateState) {
                // Cancelar todos los turnos del profesional
                const professionalAppointments = await db.appointment.findMany({
                    where: {
                        professional_id: user.professional.id,
                        state: "pendiente",
                    },
                    include: { Reservations: true },
                });

                await Promise.all(
                    professionalAppointments.map(async (appointment) => {
                        // Cambiar el estado del turno a "cancelado"
                        await db.appointment.update({
                            where: { id: appointment.id },
                            data: { state: "cancelado" },
                        });

                        // Cancelar todas las reservaciones asociadas al turno
                        await Promise.all(
                            appointment.Reservations.map(async (reservation) => {
                                await db.reservation.update({
                                    where: {
                                        appointment_id_patient_id: {
                                            appointment_id: reservation.appointment_id,
                                            patient_id: reservation.patient_id,
                                        },
                                    },
                                    data: { state: "cancelada" },
                                });
                            })
                        );
                    })
                );

                // Cancelar turnos "disponibles" sin reservaciones
                const availableAppointments = await db.appointment.findMany({
                    where: {
                        professional_id: user.professional.id,
                        state: "disponible",
                    },
                });

                await Promise.all(
                    availableAppointments.map(async (appointment) => {
                        await db.appointment.update({
                            where: { id: appointment.id },
                            data: { state: "cancelado" },
                        });
                    })
                );
            }

            if (updateState && !user.patient) {
                await db.user.update({
                    where: { id: user.id },
                    data: { state: true },
                });
            }

            if (!updateState && !user.patient) {
                await db.user.update({
                    where: { id: user.id },
                    data: { state: false },
                });
            }
        } else {
            return NextResponse.json(
                { error: `Role '${role}' not found for user` },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: `Role state updated successfully (${action})` },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user state:", error);
        return NextResponse.json(
            { error: "Failed to update user state" },
            { status: 500 }
        );
    }
}
