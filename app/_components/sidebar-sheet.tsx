"use client"

import { Button } from "./ui/button"
import {
  Calendar1Icon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  User2Icon,
} from "lucide-react"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { signOut, useSession } from "next-auth/react"
import LoginContent from "./login-dialog"

const SidebarSheet = () => {
  const { data } = useSession()
  const handleLogoutClick = () => signOut()

  return (
    <SheetContent className="overflow-y-auto px-6">
      <SheetHeader className="px-0">
        <SheetTitle className="text-left">Menu</SheetTitle>
      </SheetHeader>

      <div className="flex items-center justify-between gap-3 border-b border-solid py-5">
        {data?.user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-[45px] w-[45px] overflow-hidden border-2 border-solid border-primary">
              {data.user.image && (
                <AvatarImage
                  key={data.user.image}
                  src={data.user.image}
                  alt={data.user.name ?? "Usuário"}
                />
              )}

              <AvatarFallback>
                <User2Icon />
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-bold">{data?.user?.name}</p>
              <p className="text-xs">{data?.user?.email}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold">Olá, faça seu login!</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon">
                  <LogInIcon />
                </Button>
              </DialogTrigger>
              <LoginContent />
            </Dialog>
          </>
        )}
      </div>

      <div className="flex flex-col gap-2 border-b border-solid">
        <SheetClose asChild>
          <Button className="justify-start gap-2 p-5" variant={"ghost"} asChild>
            <Link href="/">
              <HomeIcon size={18} />
              Início
            </Link>
          </Button>
        </SheetClose>

        <Button className="justify-start gap-2 p-5" variant="ghost" asChild>
          <Link href="/bookings">
            <Calendar1Icon size={18} />
            Agendamentos
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-2 border-b border-solid py-5">
        {quickSearchOptions.map((option) => (
          <SheetClose key={option.title} asChild>
            <Button
              className="justify-start gap-2 p-5"
              variant={"ghost"}
              asChild
            >
              <Link href={`/barbershops?service=${option.title}`}>
                <Image
                  alt={option.title}
                  src={option.imageUrl}
                  width={18}
                  height={18}
                />
                {option.title}
              </Link>
            </Button>
          </SheetClose>
        ))}
      </div>

      {data?.user && (
        <div className="flex flex-col gap-2 border-b border-solid py-5">
          <Button
            className="justify-start gap-2 p-5"
            variant="ghost"
            onClick={handleLogoutClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
