import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation } from '@apollo/client'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { toast } from 'react-hot-toast'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSmileWink as fasSmileWink } from '@fortawesome/free-solid-svg-icons'
import * as Yup from 'yup'

import { Layout, Links, Meta, Header, Footer, Main } from '@components/common'
import { Input } from '@components/base'

import { useExistedCheck } from '@lib/hooks'

import { AccountType, SignUpInput, SignUpOutput } from '@lib/api/schema'
import { Result, Variables } from '@lib/api/graphql'
import { SIGN_UP_MUTATION } from '@lib/api/mutations'

interface Fields {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

const SignUp: NextPage = () => {
  // For watch the input control value changes
  const [isChanged, setIsChanged] = useState(false)

  const router = useRouter()
  const emailExistedCheck = useExistedCheck()
  const usernameExistedCheck = useExistedCheck()

  const [signUp] = useMutation<Result<SignUpOutput>, Variables<SignUpInput>>(SIGN_UP_MUTATION, {
    onCompleted: (data) => {
      toast.success('Hello, ' + data.signUp.user + '!')
      router.push('/sign-in')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  // Validation schema
  const schema = Yup.object()
    .shape({
      firstName: Yup.string()
        .required('First name is required!')
        .matches(/[A-Za-z]/, 'First Name only allows letters!'),
      lastName: Yup.string()
        .required('Last name is required!')
        .matches(/[A-Za-z]/, 'Last Name only allows letters!'),
      email: Yup.string()
        .required('Email is required!')
        .email('Email is invalid!')
        .test('existed-check', 'This email was registered!', () => !emailExistedCheck.isExisted),
      username: Yup.string()
        .required('Username is required!')
        .min(3, 'Username must be at least 3 characters!')
        .matches(/^[A-Za-z][a-zA-Z0-9_]*$/, 'Username only allows "A-Za-z0-9_" combination!')
        .test('existed-check', 'This username was registered!', () => !usernameExistedCheck.isExisted),
      password: Yup.string().required('Password is required!').min(6, 'Password must be at least 6 characters!'),
      confirmPassword: Yup.string()
        .required('Confirm password is required!')
        .oneOf([Yup.ref('password')], 'Passwords do not match!'),
    })
    .required()

  // Form setup
  const form = useForm<Fields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    resolver: yupResolver(schema),
  })

  const submitHandler: SubmitHandler<Fields> = ({ confirmPassword, ...rest }) => {
    signUp({
      variables: {
        input: {
          firstName: rest.firstName,
          lastName: rest.lastName,
          email: rest.email,
          username: rest.username,
          password: rest.password,
        },
      },
    })
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
        <Main decorated>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="mx-auto my-12 pt-10 pb-12 px-8 w-3/4 sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-[40%] bg-white rounded-xl shadow-sm dark:bg-gray-800/70"
            >
              <h1 className="mb-4 text-3xl md:text-4xl font-bold text-black dark:text-white">
                <FontAwesomeIcon icon={fasSmileWink} className="mr-3" />
                Sign Up!
              </h1>
              <div className="flex">
                {/* First Name Input */}
                <div className="mr-5 flex-1">
                  <label htmlFor="firstName" className="text-lg leading-9 dark:text-gray-300">
                    First Name
                  </label>
                  <Input
                    type="text"
                    id="firstName"
                    placeholder="Typing your first name here"
                    autoFocus
                    {...form.register('firstName', {
                      onBlur: () => form.trigger('firstName'),
                    })}
                  />
                  <p className="text-sm text-red-500">{form.formState.errors['firstName']?.message}</p>
                </div>
                {/* Last Name Input */}
                <div className="flex-1">
                  <label htmlFor="lastName" className="text-lg leading-9 dark:text-gray-300">
                    Last Name
                  </label>
                  <Input
                    type="text"
                    id="lastName"
                    placeholder="Typing your last name here"
                    {...form.register('lastName', {
                      onBlur: () => form.trigger('lastName'),
                    })}
                  />
                  <p className="text-sm text-red-500">{form.formState.errors['lastName']?.message}</p>
                </div>
              </div>
              {/* Email Input */}
              <label htmlFor="email" className="text-lg leading-9 dark:text-gray-300">
                Email
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Typing your email here"
                {...form.register('email', {
                  onChange: () => setIsChanged(true),
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      emailExistedCheck.setVariables({
                        type: AccountType.EMAIL,
                        value: e.target.value,
                      })
                      setIsChanged(false)
                    }
                    form.trigger('email')
                  },
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['email']?.message}</p>
              {/* Username Input */}
              <label htmlFor="username" className="text-lg leading-9 dark:text-gray-300">
                Username
              </label>
              <Input
                type="text"
                id="username"
                placeholder="Typing your username here"
                {...form.register('username', {
                  onChange: () => setIsChanged(true),
                  onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                    if (isChanged && e.target.value) {
                      usernameExistedCheck.setVariables({
                        type: AccountType.USERNAME,
                        value: e.target.value,
                      })
                      setIsChanged(false)
                    }
                    form.trigger('username')
                  },
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['username']?.message}</p>
              {/* Password input */}
              <label htmlFor="password" className="text-lg leading-9 dark:text-gray-300">
                Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="Typing your password here"
                {...form.register('password', {
                  onBlur: () => form.trigger('password'),
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['password']?.message}</p>
              {/* Confirm Password Input */}
              <label htmlFor="confirmPassword" className="text-lg leading-9 dark:text-gray-300">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Typing your password here again"
                {...form.register('confirmPassword', {
                  onBlur: () => form.trigger('confirmPassword'),
                })}
              />
              <p className="text-sm text-red-500">{form.formState.errors['confirmPassword']?.message}</p>
              {/* Links */}
              <div className="flex justify-end">
                <Link href="/sign-in">
                  <a className="my-2 text-blue-400 cursor-pointer hover:underline">Have an account?</a>
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
        </Main>

        {/* HOME FOOTER */}
        <Footer />
      </Layout>
    </>
  )
}

export default SignUp
