"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

export const createBooking = async (params: CreateBookingParams) => {
  const session = await getServerSession(authOptions)
  if (!session) throw new Error("Usuário não autenticado")

  try {
    await db.booking.create({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...params, userId: (session.user as any).id },
    })
    revalidatePath("/barbershops/[id]")
    revalidatePath("/bookings")
  } catch (error) {
    console.error(error)
    throw new Error("Erro ao criar reserva.")
  }
}
