import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Router from 'next/router'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'
import * as Yup from 'yup'

import {
  Layout,
  Links,
  Meta,
  Header,
  Footer,
  Content,
} from '@components/common'
import { useExistedCheck } from '@lib/hooks'
import { EAccountType } from 'typings'
import { FormInput } from '@components/platform'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmileWink } from '@fortawesome/free-solid-svg-icons'
import httpCsr from '@lib/utils/http-csr'

interface Fields {
  first_name: string
  last_name: string
  email: string
  username: string
  password: string
  confirm_password: string
}

export default function SignUp() {
  // For watch the input control value changes
  const [isChanged, setIsChanged] = useState(false)

  const emailExistedCheck = useExistedCheck()
  const usernameExistedCheck = useExistedCheck()

  // Validation schema
  const schema = Yup.object()
    .shape({
      first_name: Yup.string()
        .required('First name is required!')
        .matches(/[A-Za-z]/, 'First Name only allows letters!'),
      last_name: Yup.string()
        .required('Last name is required!')
        .matches(/[A-Za-z]/, 'Last Name only allows letters!'),
      email: Yup.string()
        .required('Email is required!')
        .email('Email is invalid!')
        .test(
          'existed-check',
          'This email was registered!',
          () => !emailExistedCheck.isExisted
        ),
      username: Yup.string()
        .required('Username is required!')
        .min(3, 'Username must be at least 3 characters!')
        .matches(
          /^[A-Za-z][a-zA-Z0-9_]*$/,
          'Username only allows "A-Za-z0-9_" combination!'
        )
        .test(
          'existed-check',
          'This username was registered!',
          () => !usernameExistedCheck.isExisted
        ),
      password: Yup.string()
        .required('Password is required!')
        .min(6, 'Password must be at least 6 characters!'),
      confirm_password: Yup.string()
        .required('Confirm password is required!')
        .oneOf([Yup.ref('password')], 'Passwords do not match!'),
    })
    .required()

  // Form setup
  const form = useForm<Fields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      username: '',
      password: '',
      confirm_password: '',
    },
    resolver: yupResolver(schema),
  })

  const submitHandler: SubmitHandler<Fields> = async ({
    confirm_password,
    ...rest
  }) => {
    const { data, status } = await httpCsr.post('/auth/sign-up', rest)

    if (status === 201) {
      localStorage.setItem('access-token', data.access_token)
      localStorage.setItem('refresh-token', data.refresh_token)

      toast.success('Sign up successfully!')

      Router.push('/')
    }
  }

  useEffect(() => {
    form.watch('email') && form.trigger('email')
    form.watch('username') && form.trigger('username')
  }, [emailExistedCheck.isExisted, usernameExistedCheck.isExisted])

  return (
    <>
      <Head>
        <title>Srcube | Sign Up</title>
        <Meta />
        <Links />
      </Head>

      <Layout>
        {/* HOME HEADER */}
        <Header />

        {/* HOME CONTENT */}
        <Content decorated>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="mx-auto my-12 pt-10 pb-12 px-8 w-3/4 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-[40%] bg-white rounded-xl shadow-sm dark:bg-gray-800/70"
            >
              <h1 className="mb-4 text-3xl md:text-4xl font-bold text-black dark:text-white">
                <FontAwesomeIcon icon={faSmileWink} className="mr-3" />
                Sign Up!
              </h1>
              <div className="flex">
                {/* First Name Input */}
                <div className="flex-1">
                  <label
                    htmlFor="first_name"
                    className="text-lg leading-9 dark:text-gray-300"
                  >
                    First name
                  </label>
                  <FormInput
                    type="text"
                    id="first_name"
                    placeholder="Typing your first name here"
                    autoFocus
                    {...form.register('first_name', {
                      onBlur: () => form.trigger('first_name'),
                    })}
                  />
                  <p className="text-sm text-red-500">
                    {form.formState.errors['first_name']?.message}
                  </p>
                </div>
                <span className="relative top-12 px-2">-</span>
                {/* Last Name Input */}
                <div className="flex-1">
                  <label
                    htmlFor="last_name"
                    className="text-lg leading-9 dark:text-gray-300"
                  >
                    Last name
                  </label>
                  <FormInput
                    type="text"
                    id="last_name"
                    placeholder="Typing your last name here"
                    {...form.register('last_name', {
                      onBlur: () => form.trigger('last_name'),
                    })}
                  />
                  <p className="text-sm text-red-500">
                    {form.formState.errors['last_name']?.message}
                  </p>
                </div>
              </div>
              {/* Email Input */}
              <label
                htmlFor="email"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Email
              </label>
              <FormInput
                type="email"
                id="email"
                placeholder="Typing your email here"
                {...form.register('email', {
                  onChange: () => setIsChanged(true),
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      emailExistedCheck.setInput({
                        type: EAccountType.EMAIL,
                        value: e.target.value,
                      })
                      setIsChanged(false)
                    }
                    form.trigger('email')
                  },
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['email']?.message}
              </p>
              {/* Username Input */}
              <label
                htmlFor="username"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Username
              </label>
              <FormInput
                type="text"
                id="username"
                placeholder="Typing your username here"
                {...form.register('username', {
                  onChange: () => setIsChanged(true),
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      usernameExistedCheck.setInput({
                        type: EAccountType.USERNAME,
                        value: e.target.value,
                      })
                      setIsChanged(false)
                    }
                    form.trigger('username')
                  },
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['username']?.message}
              </p>
              {/* Password input */}
              <label
                htmlFor="password"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Password
              </label>
              <FormInput
                type="password"
                id="password"
                placeholder="Typing your password here"
                {...form.register('password', {
                  onBlur: () => form.trigger('password'),
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['password']?.message}
              </p>
              {/* Confirm Password Input */}
              <label
                htmlFor="confirm_password"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Confirm Password
              </label>
              <FormInput
                type="password"
                id="confirm_password"
                placeholder="Typing your password here again"
                {...form.register('confirm_password', {
                  onBlur: () => form.trigger('confirm_password'),
                })}
              />
              <p className="text-sm text-red-500">
                {form.formState.errors['confirm_password']?.message}
              </p>
              {/* Links */}
              <div className="flex justify-end">
                <Link href="/sign-in">
                  <a className="my-2 text-blue-400 cursor-pointer hover:underline">
                    Have an account?
                  </a>
                </Link>
              </div>
              {/* Submit Input */}
              <input
                type="submit"
                className="mt-2 py-2 w-full rounded-md bg-blue-600 text-xl cursor-pointer text-white dark:text-gray-200"
                value="SIGN UP"
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
