"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Field, FieldError } from "./ui/field"

const formSchema = z.object({
  search: z.string().trim().min(1, "Digite algo para buscar"),
})

const Search = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: "",
    },
  })

  const router = useRouter()

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?search=${data.search}`)
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-2">
      <Controller
        name="search"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              autoComplete="off"
              placeholder="Faça sua busca..."
              className="w-full"
              {...field}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      ></Controller>
      <Button type="submit">
        <SearchIcon />
      </Button>
    </form>
  )
}

export default Search
