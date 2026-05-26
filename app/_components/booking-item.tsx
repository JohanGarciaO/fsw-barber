import { Prisma } from "@prisma/client"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { format, isFuture } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Image from "next/image"
import PhoneItem from "./phone-item"

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
  const { barbershop } = booking.service
  const isConfirmed = isFuture(booking.date)
  return (
    <>
      <Sheet>
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
        <SheetContent className="min-w-[90%] p-6">
          <SheetHeader className="p-0">
            <SheetTitle className="w-full">Informações da Reserva</SheetTitle>
          </SheetHeader>

          <div className="relative mt-6 flex h-[180px] w-full items-end justify-center">
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
          </div>

          <div className="mt-3 flex flex-col gap-3">
            {barbershop.phones.map((phone, index) => (
              <PhoneItem key={`${index}-${phone}`} phone={phone} />
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default BookingItem
