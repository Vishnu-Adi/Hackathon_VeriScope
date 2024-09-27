"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { login } from "@/lib/actions/auth";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className, ...props }: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  // Refs for focusing the inputs when validation fails
  const emailRef = React.useRef<HTMLInputElement>(null);
  const passwordRef = React.useRef<HTMLInputElement>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  async function onSubmit() {
    setIsLoading(true);

    // Validation: Check if email or password is missing
    if (!email) {
      toast.error("Please enter your email.");
      emailRef.current?.focus(); // Focus on the email input
      setIsLoading(false);
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      passwordRef.current?.focus(); // Focus on the password input
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      toast.success("You have successfully logged in.");
    } catch (error) {
      toast.error("Something went wrong.");
    }

    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            ref={emailRef} // Attach the emailRef for focus
          />
        </div>
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="●●●●●●●●"
            type="password"
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect="off"
            disabled={isLoading}
            ref={passwordRef} // Attach the passwordRef for focus
          />
        </div>
        <Button disabled={isLoading} onClick={onSubmit}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </div>
    </div>
  );
}
