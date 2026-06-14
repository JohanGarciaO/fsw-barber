import { OrderStatus } from "@prisma/client"
import { Badge } from "./ui/badge"
import { Spinner } from "./ui/spinner"

interface BadgeBookingItemProps {
  status: OrderStatus
}

const BadgeBookingItem = ({ status }: BadgeBookingItemProps) => {
  return (
    <Badge
      variant={orderStatusTranslate.variant[status] as "default"}
      className="w-fit rounded-xl"
    >
      {orderStatusTranslate.label[status]}
      {status === OrderStatus.PENDING && <Spinner data-icon="inline-start" />}
    </Badge>
  )
}

const orderStatusTranslate = {
  label: {
    PENDING: "Pendente",
    PAYMENT_CONFIRMED: "Pagamento confirmado",
    PAYMENT_FAILED: "Revise o pagamento",
    FINISHED: "Finalizado",
  },
  variant: {
    PENDING: "secondary",
    PAYMENT_CONFIRMED: "default",
    PAYMENT_FAILED: "destructive",
    FINISHED: "secondary",
  },
}

export default BadgeBookingItem
