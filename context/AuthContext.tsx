/* eslint-disable @next/next/no-img-element */
import { Session } from '@supabase/supabase-js'
import { type EmailOtpType } from '@supabase/supabase-js'

import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import PasswordRecoveryModal from '../components/auth/PasswordRecoveryModal'
import { toast } from 'react-toastify'
import Letsgo from '@/components/auth/Auth'
import { supabase } from '@/lib/supabase'

export type AuthContextType = {
  session: Session | null
  token: string | null
  supabase: typeof supabase
  user: any | null
  setUser: (user: any) => void
}

export const AuthContext = createContext<AuthContextType>({
  session: null,
  token: null,
  supabase: supabase,
  user: null,
  setUser: () => { },
})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false)
  const [passwordRecoveryError, setPasswordRecoveryError] = useState<string | null>(null)

  // Handle authentication state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth Event:', event)

      setSession(session)
      setToken(session?.access_token || null)
      setLoading(false) // Mark authentication as resolved
      switch (event) {
        case 'SIGNED_OUT':
          setToken(null)
          break
        case 'PASSWORD_RECOVERY':
          setShowPasswordRecovery(true)
          break
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Set Supabase real-time authentication
  useEffect(() => {
    if (session?.access_token) {
      supabase.realtime.setAuth(session.access_token)
    }
  }, [session])

  // Verifies OTP for email-based actions (Used for password reset)
  useEffect(() => {
    const verifyOtp = async () => {
      const url = new URL(window.location.href)
      const token_hash = url.searchParams.get('token_hash')
      const type = url.searchParams.get('type') as EmailOtpType | null

      if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (error) {
          console.error('OTP Verification Error:', error)
        }
      }
    }

    verifyOtp()
  }, [])

  // Handle password recovery
  const handlePasswordRecovery = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      console.error('Password Recovery Error:', error)
      setPasswordRecoveryError('There was an error updating your password.')
      return
    }

    setShowPasswordRecovery(false)
    toast.success('Password updated successfully!')
  }

  // Loading state
  if (loading) {
    return (
      <div className='min-h-screen flex justify-center items-center bg-white'>
        <p className='text-3xl'>Loading...</p>
      </div>
    )
  }

  // If no session, show login/signup screen
  if (!session) {
    return (
      <div className='min-h-screen w-full flex justify-center items-center bg-transparent'>
        <div className='bg-white w-full overflow-auto flex'>
          <Letsgo />
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ session, token, supabase, user, setUser }}>
      {children}
      {showPasswordRecovery && (
        <PasswordRecoveryModal
          onSubmit={handlePasswordRecovery}
          error={passwordRecoveryError}
          onClose={() => setShowPasswordRecovery(false)}
        />
      )}
    </AuthContext.Provider>
  )
}
