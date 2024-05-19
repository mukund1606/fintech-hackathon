"use client";

// React
import React, { useEffect, useState } from "react";

// Next Auth
import { signIn } from "next-auth/react";

// Form Validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type * as z from "zod";

// Icons
import { Eye, EyeOff } from "lucide-react";

// Components
import { toast } from "sonner";

import { Form, FormField, FormItem } from "@/components/ui/form";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Input,
} from "@nextui-org/react";

// Utils
import { clientEncryption } from "@/lib/utils";

// Schema
import { api, isTRPCClientError } from "@/trpc/react";
import { RegisterFormSchema } from "@/types/forms";

export default function RegisterForm({ error }: { error?: string }) {
  const registerRoute = api.register.useMutation();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  async function submitForm(values: z.infer<typeof RegisterFormSchema>) {
    values.password = clientEncryption(values.password);
    try {
      await registerRoute.mutateAsync(values);
      toast.success("User registered successfully!", {
        description: "You can now login to your account.",
      });
      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/",
      });
    } catch (error) {
      if (isTRPCClientError(error)) {
        toast.error("Error", {
          description: error.message,
        });
      }
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (error) {
        toast.error("Error", {
          description: error,
        });
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [error]);
  return (
    <>
      <div className="my-auto grid justify-center p-4 md:p-8">
        <Card className="max-w-[400px]">
          <CardHeader className="flex gap-3">
            <Image
              alt="logo"
              height={128}
              width={128}
              radius="full"
              src="/logo.png"
            />
            <div className="flex flex-col">
              <h1 className="w-full py-1 text-left font-fredoka text-3xl font-semibold">
                Register
              </h1>
              <p className="font-abeezee text-muted-foreground">
                Register to Nexus
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="gap-5">
            <Form {...form}>
              {error ? (
                <div className="text-center text-danger">
                  <p>{error}</p>
                </div>
              ) : null}
              <form
                onSubmit={form.handleSubmit(submitForm)}
                className="flex w-full flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        label="Name"
                        variant="bordered"
                        classNames={{
                          description: "text-sm",
                          label: "font-abeezee font-bold",
                        }}
                        size="lg"
                        {...field}
                        isInvalid={form.formState.errors.name !== undefined}
                        errorMessage={form.formState.errors.name?.message}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        label="Email"
                        variant="bordered"
                        classNames={{
                          description: "text-sm",
                          label: "font-abeezee font-bold",
                        }}
                        size="lg"
                        {...field}
                        isInvalid={form.formState.errors.email !== undefined}
                        errorMessage={form.formState.errors.email?.message}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Input
                        label="Password"
                        type={isPasswordVisible ? "text" : "password"}
                        variant="bordered"
                        classNames={{
                          description: "text-sm",
                          label: "font-abeezee font-bold",
                        }}
                        size="lg"
                        {...field}
                        isInvalid={form.formState.errors.password !== undefined}
                        errorMessage={form.formState.errors.password?.message}
                        endContent={
                          <Button
                            type="button"
                            variant="light"
                            onPress={() => {
                              setIsPasswordVisible(!isPasswordVisible);
                            }}
                            isIconOnly
                            tabIndex={-1}
                          >
                            {isPasswordVisible ? <EyeOff /> : <Eye />}
                          </Button>
                        }
                      />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  color="primary"
                  className="px-2 text-center font-abeezee text-base font-bold"
                  isLoading={registerRoute.isPending}
                  isDisabled={registerRoute.isPending}
                >
                  Register
                </Button>
                <div>
                  <p className="text-center text-muted-foreground">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-primary">
                      Login
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
