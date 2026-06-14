"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { Dialog, DialogTrigger } from "./ui/dialog"
import LoginContent from "./login-dialog"
import { getBookings } from "../_actions/get-bookings"
import BookingSummary from "./booking-summary"
// import { useRouter } from "next/navigation"
import { createStripeCheckout } from "../_actions/create-stripe-checkout"
import { loadStripe } from "@stripe/stripe-js"

interface ServiceItemProp {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name">
}
const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

const getTimeList = (bookings: Booking[], selectedDay: Date) => {
  const now = new Date()
  return TIME_LIST.filter((time) => {
    const hour = Number(time.split(":")[0])
    const minute = Number(time.split(":")[1])

    const slotDate = new Date(selectedDay)
    slotDate.setHours(hour, minute, 0, 0)

    const isFutureTime = slotDate > now

    const hasBookingOnCurrentTime = bookings.some(
      (booking) =>
        booking.date.getHours() === hour &&
        booking.date.getMinutes() === minute,
    )

    return isFutureTime && !hasBookingOnCurrentTime
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProp) => {
  // const router = useRouter()
  const { data } = useSession()
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )

  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  useEffect(() => {
    ;(async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    })()
  }, [selectedDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime.split(":")[0]),
      minutes: Number(selectedTime.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleDateSelected = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string | undefined) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return

      const booking = await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })

      // Criar ordem
      const { sessionId } = await createStripeCheckout({
        serviceId: service.id,
        bookingId: booking.id,
      })
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) return
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

      stripe?.redirectToCheckout({
        sessionId: sessionId,
      })

      // toast.success(
      //   "Seu pagamento foi aprovado e a reserva foi criada com sucesso!",
      //   {
      //     action: {
      //       label: "Ver Agendamentos",
      //       onClick: () => router.push("/bookings"),
      //     },
      //   },
      // )
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSelectedDay(undefined)
      setSelectedTime(undefined)
      setDayBookings([])
    }
  }

  return (
    <Card className="p-0">
      <CardContent className="flex items-center gap-3 p-3">
        {/* IMAGE */}
        <div className="relative max-h-[110px] min-h-[110px] min-w-[110px] max-w-[110px]">
          <Image
            alt={service.name}
            src={service.imageUrl}
            fill
            className="rounded-lg object-cover"
          />
        </div>

        {/* DIREITA */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="text-sm text-gray-400">{service.description}</p>
          {/* PREÇO E BOTÃO */}
          <div className="flex items-center justify-between">
            <p className="text-md font-bold text-primary">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Sheet>
              {data?.user ? (
                <SheetTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-lg p-4"
                  >
                    Reservar
                  </Button>
                </SheetTrigger>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-lg p-4"
                    >
                      Reservar
                    </Button>
                  </DialogTrigger>
                  <LoginContent />
                </Dialog>
              )}

              <SheetContent className="gap-0 px-0">
                <SheetHeader className="border-b">
                  <SheetTitle>Fazer Reserva</SheetTitle>
                </SheetHeader>

                <div className="border-b py-5">
                  <Calendar
                    mode="single"
                    selected={selectedDay}
                    onSelect={handleDateSelected}
                    fromDate={new Date()}
                    locale={ptBR}
                    styles={{
                      head_cell: {
                        width: "100%",
                        textTransform: "capitalize",
                      },
                      cell: {
                        width: "100%",
                      },
                      button: {
                        width: "100%",
                      },
                      nav_button_previous: {
                        width: "32px",
                        height: "32px",
                      },
                      nav_button_next: {
                        width: "32px",
                        height: "32px",
                      },
                      caption: {
                        textTransform: "capitalize",
                      },
                    }}
                  />
                </div>

                {selectedDay && (
                  <div className="flex gap-3 overflow-x-scroll border-b p-5 [&::-webkit-scrollbar]:hidden">
                    {getTimeList(dayBookings, selectedDay)?.length > 0 ? (
                      getTimeList(dayBookings, selectedDay).map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? "default" : "outline"
                          }
                          className="rounded-2xl"
                          onClick={() =>
                            time !== selectedTime
                              ? handleTimeSelect(time)
                              : handleTimeSelect(undefined)
                          }
                        >
                          {time}
                        </Button>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">
                        Nenhum horário disponível
                      </p>
                    )}
                  </div>
                )}

                {selectedDate && (
                  <div className="p-5">
                    <BookingSummary
                      barbershop={barbershop}
                      service={service}
                      selectedDate={selectedDate}
                    />
                  </div>
                )}

                <SheetFooter className="mt-5 px-5">
                  <SheetClose asChild>
                    <Button
                      size={"lg"}
                      type="submit"
                      onClick={() => handleCreateBooking()}
                      disabled={!selectedDay || !selectedTime}
                    >
                      Confirmar
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
