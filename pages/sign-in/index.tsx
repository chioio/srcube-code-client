import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/router'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKissWinkHeart as fasKissWinkHeart } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'

import { Layout, Links, Meta, Header, Footer, Main } from '@components/common'
import { Input } from '@components/base'

import { useWindowMounted, useExistedCheck } from '@lib/hooks'

import { AccountType, SignInInput, SignInOutput } from '@lib/api/schema'
import { SIGN_IN_MUTATION } from '@lib/api/mutations'
import { Result, Variables } from '@lib/api/graphql'
import { useRecoilState } from 'recoil'
import { userProfileState } from '@lib/store/atoms'

interface Fields {
  account: string
  password: string
  type: AccountType
}

const SignIn: NextPage = () => {
  // For the input control value changing
  const [isChanged, setIsChanged] = useState(false)

  const [, setUserProfile] = useRecoilState(userProfileState)

  const router = useRouter()
  const isWindowMounted = useWindowMounted()
  const accountExistedCheck = useExistedCheck()

  const [signIn] = useMutation<Result<SignInOutput>, Variables<SignInInput>>(SIGN_IN_MUTATION, {
    onCompleted: (data) => {
      toast.success('Hello, ' + data.signIn.profile.username + '!')

      setUserProfile(data.signIn.profile)

      isWindowMounted &&
        (localStorage.setItem('token', data.signIn.token), localStorage.setItem('user', data.signIn.profile.username))

      router.push('/')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Validation schema
  const schema = Yup.object().shape({
    account: Yup.string()
      .required('Account is required!')
      .test('existed-check', 'This account has not been registered!', () => accountExistedCheck.isExisted),
    password: Yup.string().required('Password is required!'),
  })

  // Form setup
  const form = useForm<Fields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      account: '',
      password: '',
      type: AccountType.USERNAME,
    },
    resolver: yupResolver(schema),
  })

  // Form submit handler
  const submitHandler: SubmitHandler<Fields> = ({ account, password, type }) => {
    signIn({
      variables: {
        input: {
          account: account,
          password: password,
          type: type,
        },
      },
    })
  }

  useEffect(() => {
    form.watch('account') && form.trigger('account')
  }, [accountExistedCheck.isExisted])

  return (
    <>
      <Head>
        <title>Srcube | Sign In</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <Main decorated>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="mx-auto my-12 pt-10 pb-12 px-8 w-3/4 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-[40%] bg-white rounded-xl shadow-sm dark:bg-gray-800/70"
            >
              <h1 className="mb-6 text-3xl md:text-4xl font-bold text-black dark:text-white">
                <FontAwesomeIcon icon={fasKissWinkHeart} className="mr-3" />
                Sign In!
              </h1>
              {/* Account Input */}
              <label htmlFor="account" className="text-lg leading-9 dark:text-gray-300">
                Account
              </label>
              <Input
                type="text"
                id="account"
                placeholder="username | xxx@example.com"
                autoFocus
                {...form.register('account', {
                  onChange: () => setIsChanged(true),
                  onBlur: async (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      const isEmail = await Yup.string().email().isValid(e.target.value)

                      isEmail &&
                        (accountExistedCheck.setVariables({
                          type: AccountType.EMAIL,
                          value: e.target.value,
                        }),
                        form.setValue('type', AccountType.EMAIL))
                      isEmail ||
                        (accountExistedCheck.setVariables({
                          type: AccountType.USERNAME,
                          value: e.target.value,
                        }),
                        form.setValue('type', AccountType.USERNAME))
                      setIsChanged(false)
                    }
                    form.trigger('account')
                  },
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['account']?.message}</p>
              {/* Password Input */}
              <label htmlFor="password" className="text-lg leading-9 dark:text-gray-300">
                Password
              </label>
              <Input
                type="password"
                id="password"
                {...form.register('password', {
                  onBlur: () => form.trigger('password'),
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['password']?.message}</p>
              {/* Links */}
              <div className="flex justify-end">
                <Link href="/sign-up">
                  <a className="my-2 text-blue-400 cursor-pointer hover:underline">Still don&apos;t have an account?</a>
                </Link>
              </div>
              {/* Submit Input */}
              <input
                type="submit"
                className="mt-2 py-2 w-full rounded-md bg-blue-600 text-xl cursor-pointer text-white active:bg-blue-700 dark:text-gray-200"
                value="SIGN IN"
              />
            </form>
          </FormProvider>
        </Main>

        {/* FOOTER */}
        <Footer />
      </Layout>
    </>
  )
}

export default SignIn
