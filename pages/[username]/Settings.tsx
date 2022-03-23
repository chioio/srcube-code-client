import { Input } from '@components/base'
import { FormProvider, useForm } from 'react-hook-form'

export const Settings: React.VFC<any> = () => {
  const publicForm = useForm({
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      organization: '',
      location: '',
      email: '',
      link: '',
    },
  })

  const accountForm = useForm({
    mode: 'onSubmit',
    defaultValues: {
      account: '',
      email: '',
      oldPassword: '',
      newPassword: '',
    },
  })

  return (
    <div className="py-4">
      <h2 className="pl-4 border-l-8 border-blue-600">Public profile</h2>
      <div className="px-4 grid grid-cols-2 gap-8">
        <FormProvider {...publicForm}>
          <form className="py-4 px-8">
            <div className="max-w-lg">
              <div className="flex">
                <div className="">
                  <label htmlFor="firstName">Fist name</label>
                  <Input type="text" id="firstName" placeholder="" {...publicForm.register('firstName', {})} />
                </div>
                <span className="self-center mt-4 px-2">-</span>
                <div className="">
                  <label htmlFor="lastName">Last name</label>
                  <Input type="text" id="lastName" placeholder="" {...publicForm.register('lastName', {})} />
                </div>
              </div>
              <div className="">
                <label htmlFor="organization">Organization</label>
                <Input type="text" id="organization" placeholder="" {...publicForm.register('organization', {})} />
              </div>
              <div className="">
                <label htmlFor="location">Location</label>
                <Input type="text" id="location" placeholder="" {...publicForm.register('location', {})} />
              </div>
              <div className="">
                <label htmlFor="email">Email</label>
                <Input type="email" disabled id="email" placeholder="" {...publicForm.register('email', {})} />
              </div>
              <div className="">
                <label htmlFor="link">Link</label>
                <Input type="text" id="link" placeholder="" {...publicForm.register('link', {})} />
              </div>
              {/* Submit Input */}
              <input
                type="submit"
                className="mt-2 py-2 w-full rounded-md bg-blue-600 text-xl cursor-pointer text-white dark:text-gray-200"
                value="Save Profile"
              />
            </div>
          </form>
        </FormProvider>
        {/* Avatar */}
        <div className="max-w-md">
          <div className="">
            <label htmlFor="">Avatar</label>
            <img src="https://picsum.photos/300" className="m-4 w-40 rounded-full" alt="" />
          </div>
          <div className="">
            <label htmlFor="">Profile decorate image</label>
            <img src="https://picsum.photos/300" className="m-4 w-full h-40 rounded-md" alt="" />
          </div>
        </div>
      </div>
      {/* Account */}
      <h2 className="pl-4 border-l-8 border-blue-600">Account</h2>
      <div className="px-4 grid grid-cols-2 gap-8">
        <FormProvider {...accountForm}>
          <form className="pt-4 px-8">
            <div className="max-w-lg">
              <div className="">
                <label htmlFor="firstName">Username</label>
                <Input type="text" disabled id="firstName" placeholder="" {...accountForm.register('account', {})} />
              </div>
              <div className="">
                <label htmlFor="lastName">Email</label>
                <Input type="email" id="lastName" placeholder="" {...accountForm.register('email', {})} />
              </div>
              <div className="">
                <label htmlFor="oldPassword">Old Password</label>
                <Input type="text" id="oldPassword" placeholder="" {...accountForm.register('oldPassword', {})} />
              </div>
              <div className="">
                <label htmlFor="newPassword">New Password</label>
                <Input type="text" id="newPassword" placeholder="" {...accountForm.register('newPassword', {})} />
              </div>
              {/* Submit Input */}
              <input
                type="submit"
                className="mt-2 py-2 w-full rounded-md bg-blue-600 text-xl cursor-pointer text-white dark:text-gray-200"
                value="Update"
              />
            </div>
          </form>
        </FormProvider>
        <div className="flex flex-col justify-end rounded-lg">
          <h3 className="text-xl text-red-500 font-extrabold">Danger Zone</h3>
          <p className="py-4 mb-4">
            Deleting your account will wipe all information about you and content you’ve created on Srcube Code.
          </p>
          <button className="w-full py-2 text-xl text-white font-bold bg-red-500 rounded-md">Delete Account</button>
        </div>
      </div>
    </div>
  )
}
