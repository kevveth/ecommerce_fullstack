import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Loader2 } from "lucide-react";

const signUpSchema = z
  .object({
    firstName: z.string().min(2, {
      error: "First name must be at least 2 characters long",
    }),
    lastName: z.string().min(2, {
      error: "Last name must be at least 2 characters long",
    }),
    email: z.email({
      error: "Please enter a valid email address",
    }),
    password: z.string().min(6, {
      error: "Password must be at least 6 characters long",
    }),
    confirmPassword: z.string(),
    image: z.string().optional(),
    callbackURL: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
  onSubmit: SubmitHandler<SignUpInput>;
}

export function SignUpForm({ onSubmit }: SignUpFormProps) {
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-2xl">Create Account</CardTitle>
        <CardDescription>
          Enter your information to create a new account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name fields */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-xs text-muted-foreground">
          Secured by{" "}
          <span className="text-orange-400 font-medium">better-auth</span>
        </p>
      </CardFooter>
    </Card>
  );
}
