import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY) return
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
  })

  const signature = request.headers.get("stripe-signature")
  if (!signature) {
    return NextResponse.error()
  }
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY
  if (!webhookSecret) {
    throw new Error("Missing Stripe webhook secret key")
  }
  const text = await request.text()
  const event = stripe.webhooks.constructEvent(text, signature, webhookSecret)

  switch (event.type) {
    case "checkout.session.completed": {
      const bookingId = event.data.object.metadata?.bookingId

      if (!bookingId) {
        return NextResponse.json({
          received: true,
        })
      }

      const booking = await db.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: "PAYMENT_CONFIRMED",
        },
        include: {
          service: true,
        },
      })
      revalidatePath(`/barbershops/${booking.service.barbershopId}`)
      break
    }
    case "charge.failed": {
      const bookingId = event.data.object.metadata?.bookingId

      if (!bookingId) {
        return NextResponse.json({
          received: true,
        })
      }

      const booking = await db.booking.update({
        where: {
          id: bookingId,
        },
        data: {
          status: "PAYMENT_FAILED",
        },
        include: {
          service: true,
        },
      })
      revalidatePath(`/barbershops/${booking.service.barbershopId}`)
      break
    }
  }

  return NextResponse.json({
    received: true,
  })
}
