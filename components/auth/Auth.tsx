import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

function Letsgo() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<any>(null)
  const [data, setData] = useState<any>(null)

  const searchParams = useSearchParams()
  const state = searchParams.get('state')
  // console.log('state', state)

  // update the login state based on the URL parameter 'state'
  useEffect(() => {
    if (state == 'signup') {
      setIsLogin(false)
    } else {
      setIsLogin(true)
    }
  }, [state])

  const formVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  // Function to reset user password
  const resetPasswordForEmail = async (email: string) => {
    setLoading(true)
    // console.log(email)
    setData(null)
    setError(null)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    })

    if (error) {
      setError(error)
      console.log('Error: ', error)
      setLoading(false)
      return
    }
    setData('Password reset link sent to your email')
    setLoading(false)
    setEmail('')
  }

  // async function handleOAuthLoginGithub() {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'github',
  //     options: {
  //       redirectTo: `${window.location.origin}`,
  //     }
  //   })
  //   console.log(data)
  //   if (error) console.error('Error: ', error.message)

  //   console.log(data)
  // }

  return (
    <>
      <div className='min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex-col items-center'>
        <div className='flex items-center w-full space-x-1 py-4 px-16 absolute top-0'>
          <p className='text-2xl font-semibold text-black bg-clip-text'>
            Copy.ai
          </p>
        </div>
        <div className='w-full h-full flex-1 flex justify-center items-center'>
          <div className='w-full max-w-[450px]  bg-white rounded-2xl shadow-xl overflow-hidden relative hidden md:block'>
            <div className=' h-full'>

              {isLogin ? (
                <div className=''>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={isResetPassword ? 'reset-password-form' : 'login-form'}
                      variants={formVariants}
                      initial='hidden'
                      animate='visible'
                      exit='hidden'
                      className='p-12 flex flex-col justify-center h-full'
                    >
                      {isResetPassword ? (
                        <div>
                          <h2 className='text-3xl font-bold mb-8'>
                            Forgot Password
                          </h2>
                          <div className='space-y-4'>
                            <input
                              type="email"
                              placeholder='Email'
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                              className='w-full px-4 py-3 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600'
                            />
                            <button
                              onClick={() => resetPasswordForEmail(email)}
                              disabled={loading}
                              className='w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors'
                            >
                              {loading
                                ? 'Sending...'
                                : 'Send Password Reset Link'}
                            </button>
                            <button
                              onClick={() => setIsResetPassword(false)}
                              className='w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mt-4'
                            >
                              Back to Sign in
                            </button>
                          </div>
                          {data && (
                            <div className='py-2 px-4 w-full flex justify-center bg-green-100 rounded-lg mt-4'>
                              <p className='text-green-500'>{data}</p>
                            </div>
                          )}
                          {error && (
                            <div className='py-2 px-4 w-full flex justify-center bg-red-100 rounded-lg mt-4'>
                              <p className='text-red-500'>{error.message}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <h2 className='text-3xl font-bold mb-3'>Sign in</h2>
                          <Auth
                            view='sign_in'
                            showLinks={false}
                            supabaseClient={supabase}
                            redirectTo={`${window.location.origin}`}
                            providers={['google']}
                            appearance={{
                              style: {
                                label: { display: 'none' },
                              },
                              extend: false,
                              className: {
                                anchor: 'text-purple-600',
                                button:
                                  'flex items-center justify-center gap-2 my-2 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                                input:
                                  'w-full px-4 py-3 rounded-lg bg-gray-100 my-2 focus:outline-none focus:ring-2 focus:ring-purple-600',
                                divider:
                                  'mt-4 mb-2 h-[0.1rem] w-full bg-[#eaeaea] grid',
                                message: 'w-full flex justify-center py-1',
                              },
                            }}
                            localization={{
                              variables: {
                                sign_in: {
                                  email_input_placeholder: 'Email',
                                  password_input_placeholder: 'Password',
                                  button_label: 'Sign in',
                                },
                              },
                            }}
                          />
                          {/* <button
                          onClick={handleOAuthLoginGithub}
                          className='w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mt-2'
                        >
                          Sign in with Github
                        </button> */}
                          <button
                            onClick={() => setIsResetPassword(true)}
                            className='w-full py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors mt-2'
                          >
                            Forgot Password?
                          </button>

                          <div className="flex justify-center ite  gap-2 mt-6">
                            <p className="">Don&apos;t have an account?</p>
                            <Link href="/?state=signup" className="p-0 m-0 underline">
                              Register
                            </Link>
                          </div>

                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ) : (
                <div className=''>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key='register-form'
                      variants={formVariants}
                      exit='hidden'
                      className='p-12 flex flex-col justify-center h-full'
                    >
                      <h2 className='text-3xl font-bold mb-3 '>Sign up</h2>
                      <Auth
                        view='sign_up'
                        showLinks={false}
                        supabaseClient={supabase}
                        providers={['google']}
                        redirectTo={`${window.location.origin}`}
                        appearance={{
                          style: {
                            label: { display: 'none' },
                          },
                          // to override original styles, set this to true
                          extend: false,
                          // custom classes
                          className: {
                            anchor: 'text-purple-600',
                            button:
                              'flex items-center justify-center gap-2 my-2 w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors',
                            input:
                              'w-full px-4 py-3 rounded-lg bg-gray-100 my-2 focus:outline-none focus:ring-2 focus:ring-purple-600',
                            divider:
                              'mt-4 mb-2 h-[0.1rem] w-full bg-[#eaeaea] grid',
                            message: 'w-full flex justify-center pt-3',
                          },
                        }}
                        localization={{
                          variables: {
                            sign_up: {
                              email_input_placeholder: 'Email',
                              password_input_placeholder: 'Password',
                              button_label: 'Register',
                            },
                          },
                        }}
                      />
                      <div className="flex justify-center ite  gap-2 mt-6">
                        <p className="">Already have an account?</p>
                        <Link href="/?state=signin" className="p-0 m-0 underline">
                          Sign in
                        </Link>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Letsgo
