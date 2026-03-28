"use client"

import { useState } from "react"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { parseAllowedLogin } from "@/lib/danshari/allowed-login"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DanshariGalleryPreloadLoginHint } from "@/components/danshari/danshari-gallery-preload-ui"

export function DanshariLoginForm() {
  const [username, setUsername] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { login } = useDanshariUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const result = parseAllowedLogin(username)
    if (!result.ok) {
      setError("This name is not on the guest list.")
      return
    }
    login(result.username, result.isAdmin)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold">Welcome</CardTitle>
          <CardDescription>Enter your name to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError(null)
              }}
              className="h-12 text-base rounded-xl"
              autoFocus
              autoComplete="username"
              aria-invalid={!!error}
              aria-describedby={error ? "login-error" : undefined}
            />
            {error ? (
              <p id="login-error" className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="submit"
              disabled={!username.trim()}
              className="h-12 text-base rounded-xl"
            >
              Continue
            </Button>
          </form>
          <DanshariGalleryPreloadLoginHint />
        </CardContent>
      </Card>
    </div>
  )
}
