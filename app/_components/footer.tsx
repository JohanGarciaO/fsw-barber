import { Card, CardContent } from "./ui/card"

const Footer = () => {
  return (
    <footer>
      <Card className="rounded-none px-5 py-6">
        <CardContent>
          <p className="text-sm text-gray-400">
            &copy; Copyright <b>FSW Barber</b>
          </p>
        </CardContent>
      </Card>
    </footer>
  )
}

export default Footer
