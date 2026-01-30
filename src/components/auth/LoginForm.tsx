"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { useAuth } from "@/firebase"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const formSchema = z.object({
  email: z.string().email({ message: "Неверный формат email." }),
  password: z.string().min(6, { message: "Пароль должен быть не менее 6 символов." }),
})

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const auth = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
          title: "Вход",
          description: "Вы успешно вошли в систему!",
      });
      router.push('/learn');
      router.refresh(); // To update header state
    } catch(error: any) {
        console.error(error);
        toast({
            variant: "destructive",
            title: "Ошибка входа",
            description: error.message || "Не удалось войти. Проверьте свои данные.",
        });
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>
          Введите свои данные для входа в аккаунт.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="text-black" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Нет аккаунта?{" "}
          <Link href="/signup" className="underline">
            Зарегистрироваться
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

    