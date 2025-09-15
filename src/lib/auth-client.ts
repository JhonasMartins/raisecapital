import { createAuthClient } from "better-auth/client"

function getBaseURL() {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
  return process.env.NEXT_PUBLIC_APP_URL || vercel || 'http://localhost:3000'
}

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

export type Session = typeof authClient.$Infer.Session