import React, { LegacyRef, useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import { FormInput } from '@components/platform'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '@lib/context/AuthContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPanorama,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons'
import { BASE_URL } from '@lib/utils'
import httpCsr from '@lib/utils/http-csr'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { TWhoAmI } from 'typings'

interface ProfileFields {
  first_name: string
  last_name: string
  bio?: string
  org?: string
  location?: string
  website?: string
}

interface AccountFields {
  username: string
  email: string
  curr_password: string
  password: string
}

export const Settings: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const [isChanged, setIsChanged] = useState(false)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9">
          <ProfileEditForm />
        </div>
        <div className="h-full relative col-span-3">
          <AvatarUpload />
        </div>
      </div>
      <div className="grid grid-cols-12 gap-8">
        <BannerUpload />
      </div>
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9">
          <AccountEditForm />
        </div>
      </div>
    </div>
  )
}

const ProfileEditForm: React.FC<any> = () => {
  const { whoAmI, setWhoAmI } = useAuth()

  const [isValid, setIsValid] = useState(false)

  // Profile validation schema
  const profileSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required!'),
    last_name: Yup.string().required('Last name is required!'),
    bio: Yup.string(),
    org: Yup.string(),
    location: Yup.string(),
    website: Yup.string(),
  })

  // Profile form setup
  const profileForm = useForm<ProfileFields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      first_name: '',
      last_name: '',
      bio: '',
      org: '',
      location: '',
      website: '',
    },
    resolver: yupResolver(profileSchema),
  })

  // Form submit handler
  const submitProfileHandler: SubmitHandler<ProfileFields> = async (fields) => {
    const { data, status } = await httpCsr.post('/user/profile', fields)

    if (status === 200) {
      const whoAmI = await httpCsr.get('/auth/whoami')

      setWhoAmI(whoAmI.data)

      toast.success('Profile updated successfully!')
    }
  }

  useEffect(() => {
    if (whoAmI) {
      profileForm.setValue('first_name', whoAmI.first_name || '')
      profileForm.setValue('last_name', whoAmI.last_name || '')
      profileForm.setValue('bio', whoAmI.profile.bio || '')
      profileForm.setValue('org', whoAmI.profile.org || '')
      profileForm.setValue('location', whoAmI.profile.location || '')
      profileForm.setValue('website', whoAmI.profile.website || '')
    }
  }, [whoAmI])

  return (
    <>
      <h1 className="text-xl leading-9">Profile</h1>
      <FormProvider {...profileForm}>
        <form
          action=""
          onSubmit={profileForm.handleSubmit(submitProfileHandler)}
          className="px-4"
        >
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
                {...profileForm.register('first_name', {
                  onBlur: () => profileForm.trigger('first_name'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {profileForm.formState.errors['first_name']?.message}
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
                {...profileForm.register('last_name', {
                  onBlur: () => profileForm.trigger('last_name'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {profileForm.formState.errors['last_name']?.message}
              </p>
            </div>
          </div>
          <div className="flex-1">
            {/* Bio Input */}
            <label
              htmlFor="bio"
              className="text-lg leading-9 dark:text-gray-300"
            >
              Bio
            </label>
            <FormInput
              type="text"
              id="bio"
              placeholder="Typing your bio here"
              {...profileForm.register('bio', {
                onBlur: () => profileForm.trigger('bio'),
              })}
            />
            <p className={`${styles.form.error}`}>
              {profileForm.formState.errors['bio']?.message}
            </p>
          </div>
          <div className="flex space-x-6">
            <div className="flex-1">
              {/* Organization Input */}
              <label
                htmlFor="org"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Organization
              </label>
              <FormInput
                type="text"
                id="org"
                placeholder="Typing your organization here"
                {...profileForm.register('org', {
                  onBlur: () => profileForm.trigger('org'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {profileForm.formState.errors['org']?.message}
              </p>
            </div>
            <div className="flex-1 ">
              {/* Location Input */}
              <label
                htmlFor="location"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Location
              </label>
              <FormInput
                type="text"
                id="location"
                placeholder="Typing your location here"
                {...profileForm.register('location', {
                  onBlur: () => profileForm.trigger('bio'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {profileForm.formState.errors['location']?.message}
              </p>
            </div>
          </div>
          <div className="flex space-x-6">
            <div className="flex-1 ">
              {/* Website Input */}
              <label
                htmlFor="website"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Website
              </label>
              <FormInput
                type="text"
                id="website"
                placeholder="Typing your website here"
                {...profileForm.register('website', {
                  onBlur: () => profileForm.trigger('website'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {profileForm.formState.errors['website']?.message}
              </p>
            </div>
            <div className="flex-1 relative ">
              <button
                type="submit"
                disabled={!profileForm.formState.isDirty}
                className={`${styles.form.submit}`}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

const AvatarUpload: React.FC<any> = () => {
  const { whoAmI, setWhoAmI } = useAuth()
  const [isChange, setIsChange] = useState<boolean>(false)
  const avatarRef = useRef<HTMLImageElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async () => {
    if (inputRef.current) {
      const file = inputRef.current.files?.length
        ? inputRef.current.files[0]
        : null

      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      console.log(file)
      const { data, status } = await httpCsr.post(
        '/user/upload-avatar',
        formData
      )

      if (status === 200) {
        setWhoAmI({
          ...whoAmI,
          profile: { ...whoAmI?.profile, avatar: data.avatar },
        } as TWhoAmI)

        setIsChange(false)

        toast.success('Avatar updated!')
      }
    }
  }

  return (
    <>
      <h1 className="text-xl">Avatar</h1>
      <div className="flex flex-col space-y-4">
        <img
          ref={avatarRef}
          src={`${BASE_URL}/${whoAmI?.profile.avatar}`}
          alt=""
          className="w-32 rounded-full"
        />
        <input
          ref={inputRef}
          type="file"
          className={`${styles.file.input}`}
          onChange={(e) => {
            const file = e.target.files?.length && e.target?.files[0]
            if (file) {
              if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  if (avatarRef.current)
                    avatarRef.current.src = reader.result as string
                }
                reader.readAsDataURL(file)
                setIsChange(true)
              } else {
                toast.error('Please upload an image file!')
              }
            }
          }}
        />
        <button
          disabled={!isChange}
          onClick={handleUpload}
          className={`${styles.file.upload}`}
        >
          Upload
        </button>
      </div>
    </>
  )
}

const BannerUpload: React.FC<any> = () => {
  const [banner, setBanner] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    if (inputRef.current) {
      console.log(inputRef.current.files)
    }
  }

  const handleDeleteCurrent = () => {
    setBanner('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <>
      <div className="col-span-9">
        <h1 className="leading-loose text-xl">Banner</h1>
        <div className="px-4 h-60 w-full">
          <div className="flex flex-col items-center justify-center h-full w-full bg-gray-50 rounded-lg">
            {banner ? (
              <img
                src={banner}
                alt="banner"
                className="h-full w-full object-cover rounded-lg"
              />
            ) : (
              <FontAwesomeIcon
                icon={faPanorama}
                size="10x"
                className="text-gray-200/80"
              />
            )}
          </div>
        </div>
      </div>
      <div className="col-span-3 relative">
        <div className="absolute bottom-0 space-y-4">
          <input
            ref={inputRef}
            type="file"
            className={`${styles.file.input}`}
            onChange={(e) => {
              const file = e.target.files?.length && e.target?.files[0]
              if (file) {
                if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
                  const reader = new FileReader()
                  reader.onload = (e) => {
                    setBanner(reader.result as string)
                  }

                  reader.readAsDataURL(file)
                } else {
                  toast.error('Please upload an image file!')
                }
              }
            }}
          />
          <button
            disabled={!banner}
            onClick={handleUpload}
            className={`${styles.file.upload}`}
          >
            Upload
          </button>
          <button
            disabled={!banner}
            className={`${styles.file.delete}`}
            onClick={handleDeleteCurrent}
          >
            Delete Current
          </button>
        </div>
      </div>
    </>
  )
}

const AccountEditForm: React.FC<any> = () => {
  const { whoAmI } = useAuth()

  // Account validation schema
  const accountSchema = Yup.object().shape({
    username: Yup.string().required('Username is required!'),
    email: Yup.string().required('Email is required!'),
    password: Yup.string().required('Password is required!'),
  })

  // Account form setup
  const accountForm = useForm<AccountFields>({
    mode: 'onSubmit',
    // reValidateMode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      curr_password: '',
      password: '',
    },
    resolver: yupResolver(accountSchema),
  })

  useEffect(() => {
    if (whoAmI) {
      accountForm.setValue('username', whoAmI.username || '')
      accountForm.setValue('email', whoAmI.email || '')
    }
  }, [whoAmI])

  return (
    <>
      <h1 className="leading-loose text-xl">Account</h1>
      <FormProvider {...accountForm}>
        <form action="" className="px-4">
          <div className="flex  space-x-6">
            <div className="flex-1">
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
                {...accountForm.register('username', {
                  onBlur: () => accountForm.trigger('username'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {accountForm.formState.errors['username']?.message}
              </p>
            </div>
            <div className="flex-1">
              {/* Email Input */}
              <label
                htmlFor="email"
                className="text-lg leading-9 dark:text-gray-300"
              >
                Email
              </label>
              <FormInput
                type="text"
                id="email"
                placeholder="Typing your email here"
                {...accountForm.register('email', {
                  onBlur: () => accountForm.trigger('email'),
                })}
              />
              <p className={`${styles.form.error}`}>
                {accountForm.formState.errors['email']?.message}
              </p>
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1 ">
              <div className="">
                {/* Website Input */}
                <label
                  htmlFor="curr_password"
                  className="text-lg leading-9 dark:text-gray-300"
                >
                  Current Password
                </label>
                <FormInput
                  type="text"
                  id="curr_password"
                  placeholder="Typing your current password here"
                  {...accountForm.register('curr_password', {
                    onBlur: () => accountForm.trigger('curr_password'),
                  })}
                />
                <p className={`${styles.form.error}`}>
                  {accountForm.formState.errors['curr_password']?.message}
                </p>
              </div>
              <div className="">
                {/* Website Input */}
                <label
                  htmlFor="password"
                  className="text-lg leading-9 dark:text-gray-300"
                >
                  Password
                </label>
                <FormInput
                  type="text"
                  id="password"
                  placeholder="Typing your password here"
                  {...accountForm.register('password', {
                    onBlur: () => accountForm.trigger('password'),
                  })}
                />
                <p className={`${styles.form.error}`}>
                  {accountForm.formState.errors['password']?.message || ''}
                </p>
              </div>
            </div>
            {/* Submit */}
            <div className="flex-1 relative ">
              <button
                type="submit"
                disabled={!accountForm.formState.isValid}
                className={`${styles.form.submit}`}
                onClick={() => {}}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </FormProvider>
      {/* Danger Zone */}
      <DangerZone />
    </>
  )
}

const DangerZone: React.FC<any> = () => {
  const { whoAmI } = useAuth()

  const router = useRouter()

  const accountRef = useRef<HTMLInputElement>(null)

  const [isValid, setIsValid] = useState(false)

  const handleDelete = async () => {
    const { status } = await httpCsr.delete(`/user/account`)

    if (status === 200) {
      localStorage.removeItem('access-token')
      localStorage.removeItem('refresh-token')

      toast.success('Account deleted successfully!')
      router.push('/')
    }
  }

  return (
    <div className="mt-4 px-4 pt-2 pb-4 border-4 border-red-500 rounded-xl">
      <h1 className="leading-9 text-xl text-red-500">
        <FontAwesomeIcon icon={faTriangleExclamation} />{' '}
        <span>Danger Zone</span>
      </h1>
      <p className="font-medium text-gray-900">
        Deleting your account will wipe all information about you and content
        you’ve created on Srcube Code.
      </p>
      <p className="mt-6 text-gray-600 leading-9">
        Please input{' '}
        <code className="px-1 bg-gray-200 rounded">{whoAmI?.username}</code> to
        submit delete.
      </p>
      <div className="flex space-x-6">
        <input
          ref={accountRef}
          type="text"
          name="del_username"
          onBlur={() =>
            setIsValid(accountRef.current?.value === whoAmI?.username)
          }
          className="flex-1 border-none rounded-md bg-gray-100 focus:border-none focus:ring-0"
        />
        <button
          type="submit"
          className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded active:bg-red-600 focus:ring-4 focus:ring-red-500/40 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid}
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

const styles = {
  form: {
    error: 'h-4 text-sm text-red-500',
    submit:
      'absolute bottom-6 py-2 px-4 w-full rounded-lg text-white bg-blue-600 border-blue-500 focus:ring-4 focus:ring-blue-600/40 active:bg-blue-700 disabled:bg-opacity-50 disabled:cursor-not-allowed',
  },
  file: {
    input:
      'block w-full file:mx-auto file:cursor-pointer focus:!outline-none text-sm text-slate-500 cursor-pointer file:w-full file:py-1 file:px-4 file:mb-3 file:rounded-lg file:border-0 file:block file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100',
    upload:
      'py-1 w-full rounded-lg text-sm text-white bg-blue-600 border-blue-500 disabled:cursor-not-allowed disabled:bg-blue-600/40 focus:ring-2 focus:ring-blue-600/40 active:bg-blue-700',
    delete:
      'py-1 w-full rounded-lg text-sm text-white bg-red-500 border-red-400 disabled:cursor-not-allowed disabled:bg-red-500/40 focus:ring-2 focus:ring-red-500/40 active:bg-red-600',
  },
}
