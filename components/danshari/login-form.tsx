"use client"

import { useState } from "react"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DanshariLoginForm() {
  const [username, setUsername] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const { login } = useDanshariUser()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      login(username.trim(), isAdmin)
    }
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
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-base rounded-xl"
              autoFocus
            />
            <label className="flex items-center gap-3 text-sm text-muted-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded accent-primary"
              />
              Enter as admin
            </label>
            <Button
              type="submit"
              disabled={!username.trim()}
              className="h-12 text-base rounded-xl"
            >
              Continue
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
