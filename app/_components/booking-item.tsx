"use client"

import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"
import { Button } from "./ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"
import { useState } from "react"

interface BookingItemProps {
  booking: Prisma.BookingGetPayload<{
    include: {
      service: {
        include: {
          barbershop: true
        }
      }
    }
  }>
}

const BookingItem = ({ booking }: BookingItemProps) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const { barbershop } = booking.service
  const isConfirmed = isFuture(booking.date)
  const handleCancelBooking = async () => {
    try {
      await deleteBooking(booking.id)
      toast.success("Reserva cancelada com sucesso!")
      setIsSheetOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar reserva. Tente novamente.")
    }
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setIsSheetOpen(isOpen)
  }
  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Card className="min-w-[90%] cursor-pointer p-0 hover:bg-transparent">
            <CardContent className="flex justify-between p-0">
              {/* ESQUERDA */}
              <div className="flex flex-col gap-2 py-5 pl-5">
                <Badge
                  variant={isConfirmed ? "default" : "secondary"}
                  className="w-fit rounded-xl"
                >
                  {isConfirmed ? "Confirmado" : "Finalizado"}
                </Badge>
                <h3 className="font-semibold">{booking.service.name}</h3>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={barbershop.imageUrl}></AvatarImage>
                  </Avatar>
                  <p className="text-sm">{barbershop.name}</p>
                </div>
              </div>
              {/* DIREITA */}
              <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                <p className="text-sm capitalize">
                  {format(booking.date, "MMMM", { locale: ptBR })}
                </p>
                <p className="text-2xl">
                  {format(booking.date, "dd", { locale: ptBR })}
                </p>
                <p className="text-sm">
                  {format(booking.date, "HH:mm", { locale: ptBR })}
                </p>
              </div>
            </CardContent>
          </Card>
        </SheetTrigger>
        <SheetContent className="min-w-[85%] p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="w-full">Informações da Reserva</SheetTitle>
          </SheetHeader>

          <div className="relative mt-4 flex h-[180px] w-full items-end justify-center">
            <Image
              src="/map.png"
              alt={`Mapa da barbearia ${barbershop.name}`}
              fill
              className="rounded-xl object-cover"
            />

            <Card className="z-10 mx-5 mb-3 w-full rounded-xl p-0">
              <CardContent className="flex items-center gap-3 px-5 py-3">
                <Avatar className="h-[40px] w-[40px]">
                  <AvatarImage src={barbershop.imageUrl} />
                </Avatar>
                <div>
                  <h3 className="font-bold">{barbershop.name}</h3>
                  <p className="text-xs text-slate-300">{barbershop.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <Badge
              variant={isConfirmed ? "default" : "secondary"}
              className="w-fit rounded-xl"
            >
              {isConfirmed ? "Confirmado" : "Finalizado"}
            </Badge>
            <div>
              <Card className="mt-3 p-0">
                <CardContent className="space-y-3 p-3">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold">{booking.service.name}</h2>
                    <p className="text-sm font-bold">
                      {Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(booking.service.price))}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <h2>Data</h2>
                    <p>
                      {format(booking.date, "d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <h2>Horário</h2>
                    <p>{format(booking.date, "HH:mm", { locale: ptBR })}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <h2>Barbearia</h2>
                    <p>{barbershop.name}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mt-6 flex flex-col gap-3">
              {barbershop.phones.map((phone, index) => (
                <PhoneItem key={`${index}-${phone}`} phone={phone} />
              ))}
            </div>
          </div>

          <SheetFooter>
            <div className="flex items-center gap-3">
              <SheetClose className="w-full items-center text-center">
                <Button variant="outline" className="w-full py-5">
                  Voltar
                </Button>
              </SheetClose>

              {isConfirmed && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <div className="w-full items-center text-center">
                      <Button variant="destructive" className="w-full py-5">
                        Cancelar
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="min-w-[90%]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você quer cancelar sua reserva?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja fazer o cancelamento? Esta ação é
                        irreversível.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex flex-row items-center gap-3">
                      <div className="w-full items-center text-center">
                        <AlertDialogCancel
                          variant="secondary"
                          className="w-full py-5"
                        >
                          Cancelar
                        </AlertDialogCancel>
                      </div>

                      <div className="w-full items-center text-center">
                        <AlertDialogAction asChild>
                          <Button
                            className="w-full bg-red-500 py-5 hover:bg-red-600"
                            onClick={handleCancelBooking}
                          >
                            Confirmar
                          </Button>
                        </AlertDialogAction>
                      </div>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BookingItem
