import { format } from "date-fns"
import { Card, CardContent } from "./ui/card"
import { BarbershopService } from "@prisma/client"
import { ptBR } from "date-fns/locale"

interface BookingSummaryProps {
  service: Pick<BarbershopService, "name" | "price">
  barbershop: Pick<BarbershopService, "name">
  selectedDate: Date
}

const BookingSummary = ({
  service,
  barbershop,
  selectedDate,
}: BookingSummaryProps) => {
  return (
    <Card className="p-0">
      <CardContent className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{service.name}</h2>
          <p className="text-sm font-bold">
            {Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(Number(service.price))}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <h2>Data</h2>
          <p>
            {format(selectedDate, "d 'de' MMMM", {
              locale: ptBR,
            })}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <h2>Horário</h2>
          <p>{format(selectedDate, "HH:mm")}</p>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <h2>Barbearia</h2>
          <p>{barbershop.name}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingSummary
