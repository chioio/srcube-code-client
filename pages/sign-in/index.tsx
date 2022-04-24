import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'
import { useEffect } from 'react'
import { useState } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import toast from 'react-hot-toast'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faKissWinkHeart } from '@fortawesome/free-solid-svg-icons'

import { Meta, Links, Content, Layout, Header, Footer } from '@components/common'
import { FormInput } from '@components/platform'
import { useExistedCheck } from '@lib/hooks'
import httpCsr from '@lib/utils/http-csr'
import { EAccountType } from 'typings'

interface Fields {
  account: string
  password: string
  type: EAccountType
}

export default function SignIn() {
  const [isChanged, setIsChanged] = useState(false)
  const accountExistedCheck = useExistedCheck()

  // Validation schema
  const schema = Yup.object().shape({
    account: Yup.string()
      .required('Account is required!')
      .test(
        'existed-check',
        'This account has not been registered!',
        () => accountExistedCheck.isExisted
      ),
    password: Yup.string().required('Password is required!'),
  })

  // Form setup
  const form = useForm<Fields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      account: '',
      password: '',
      type: EAccountType.USERNAME,
    },
    resolver: yupResolver(schema),
  })

  // Form submit handler
  const submitHandler: SubmitHandler<Fields> = async (fields) => {
    const { data, status } = await httpCsr.post('/auth/sign-in', fields)

    if (status === 200) {
      localStorage.setItem('access-token', data.access_token)
      localStorage.setItem('refresh-token', data.refresh_token)

      toast.success('Sign in successfully!')

      Router.push('/')
    }
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
        <Content decorated>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="mx-auto my-12 pt-10 pb-12 px-8 w-3/4 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-[40%] bg-white rounded-xl shadow-sm dark:bg-gray-800/70"
            >
              <h1 className="mb-6 text-3xl md:text-4xl font-bold text-black dark:text-white">
                <FontAwesomeIcon icon={faKissWinkHeart} className="mr-3" />
                Sign In!
              </h1>
              {/* Account Input */}
              <label
                htmlFor="account"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Account
              </label>
              <FormInput
                type="text"
                id="account"
                placeholder="username | xxx@example.com"
                autoFocus
                {...form.register('account', {
                  onChange: () => setIsChanged(true),
                  onBlur: async (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      const isEmail = await Yup.string()
                        .email()
                        .isValid(e.target.value)

                      isEmail &&
                        (accountExistedCheck.setInput({
                          type: EAccountType.EMAIL,
                          value: e.target.value,
                        }),
                        form.setValue('type', EAccountType.EMAIL))
                      isEmail ||
                        (accountExistedCheck.setInput({
                          type: EAccountType.USERNAME,
                          value: e.target.value,
                        }),
                        form.setValue('type', EAccountType.USERNAME))
                      setIsChanged(false)
                    }
                    form.trigger('account')
                  },
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['account']?.message}
              </p>
              {/* Password Input */}
              <label
                htmlFor="password"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Password
              </label>
              <FormInput
                type="password"
                id="password"
                {...form.register('password', {
                  onBlur: () => form.trigger('password'),
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['password']?.message}
              </p>
              {/* Links */}
              <div className="flex justify-end">
                <Link href="/sign-up">
                  <a className="my-2 text-blue-400 cursor-pointer hover:underline">
                    Still don&apos;t have an account?
                  </a>
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
        </Content>

        {/* FOOTER */}
        <Footer />
      </Layout>
    </>
  )
}
