"use server"

import { headers } from "next/headers"
import Stripe from "stripe"
import { db } from "../_lib/prisma"

interface CreateStripeCheckoutInput {
  bookingId: string
  serviceId: string
}

export const createStripeCheckout = async ({
  bookingId,
  serviceId,
}: CreateStripeCheckoutInput) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Missing Stripe secret key")
    }

    const reqHeaders = await headers()
    const origin = reqHeaders.get("origin") ?? ""

    const barbeshopService = await db.barbershopService.findFirst({
      where: {
        id: serviceId,
      },
    })

    if (!barbeshopService) {
      throw new Error("Produto não encontrado ou não disponível.")
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-02-24.acacia",
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "boleto"],
      mode: "payment",
      success_url: origin,
      cancel_url: origin,
      metadata: {
        bookingId,
      },
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: barbeshopService.name,
              images: [barbeshopService.imageUrl],
            },
            unit_amount: Number(barbeshopService.price) * 100,
          },
          quantity: 1,
        },
      ],
    })
    return { sessionId: session.id }
  } catch (error) {
    console.error(error)
    throw error
  }
}
