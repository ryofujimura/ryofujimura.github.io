"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { User } from "./types"
import { getUser, setUser as saveUser, clearUser } from "./store"

interface UserContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, isAdmin?: boolean) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function DanshariUserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = getUser()
    setUserState(storedUser)
    setIsLoading(false)
  }, [])

  const login = (username: string, isAdmin = false) => {
    const newUser: User = { username, is_admin: isAdmin }
    saveUser(newUser)
    setUserState(newUser)
  }

  const logout = () => {
    clearUser()
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useDanshariUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useDanshariUser must be used within DanshariUserProvider")
  }
  return context
}
