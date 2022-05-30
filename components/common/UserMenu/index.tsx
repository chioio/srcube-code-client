import React, { Fragment, useEffect } from 'react'
import { useRouter } from 'next/router'

import { Popover, Transition } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCube, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { useAuth } from '@lib/context/AuthContext'
import { BASE_URL } from '@lib/utils'

interface UserMenuProps {}

export const UserMenu: React.FC<UserMenuProps> = () => {
  const router = useRouter()

  const { whoAmI, setWhoAmI } = useAuth()

  const handleSignOut = () => {
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    setWhoAmI(null)
    router.push('/')
  }

  const styles = {
    item: {
      li: 'cursor-pointer',
      p: 'py-0.5 px-2 rounded-md hover:bg-gray-100 hover:text-black',
    },
  }

  return (
    <Popover className="inline-block relative z-50">
      <Popover.Button className="w-9 md:w-10 overflow-hidden">
        <img
          className="inline-block align-middle h-full rounded-md bg-white overflow-hidden shadow-md cursor-pointer"
          src={`${BASE_URL}/${whoAmI!.profile.avatar}`}
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel
          className="absolute right-0 top-11 md:top-12 z-10 px-4 py-3 mt-2 w-52 md:w-56 rounded-lg border-t-[0.25rem] border-blue-600 bg-white shadow-lg 
          before:absolute before:-top-3 before:right-3 before:border-l-[0.5rem] before:border-r-[0.5rem] before:border-l-transparent before:border-r-transparent before:border-b-8 before:border-b-blue-600"
        >
          <h2 className="mb-1 text-xl font-bold">
            {`${whoAmI!.first_name} ${whoAmI!.last_name}`}
          </h2>
          <ul className="select-none font-semibold text-gray-600">
            <li className={`py-1.5 border-b ${styles.item.li}`}>
              <Link href={'/create'}>
                <p className={styles.item.p}>
                  <FontAwesomeIcon icon={faCube} className="mr-1" /> New
                  Creation
                </p>
              </Link>
            </li>
            <li className={`pt-1.5 ${styles.item.li}`}>
              <Link href={`/${whoAmI!.username}`}>
                <p className={styles.item.p}>Profile</p>
              </Link>
            </li>
            <li className={styles.item.li}>
              <Link href={`/${whoAmI!.username}?tab=creations`}>
                <p className={styles.item.p}>Creations</p>
              </Link>
            </li>
            <li className={styles.item.li}>
              <Link href={`/${whoAmI!.username}?tab=stars`}>
                <p className={styles.item.p}>Stars</p>
              </Link>
            </li>
            <li className={`${styles.item.li}`}>
              <Link href={`/${whoAmI!.username}?tab=notice`}>
                <div className="relative w-full">
                  <p className={styles.item.p}>Notifications</p>
                </div>
              </Link>
            </li>
            <li className={`pb-1.5 border-b ${styles.item.li}`}>
              <Link href={`/${whoAmI!.username}?tab=settings`}>
                <p className={styles.item.p}>Settings</p>
              </Link>
            </li>
            <li className={`pt-1.5 border-t ${styles.item.li}`}>
              <Link href="/" passHref>
                <p className={styles.item.p}>Documentation</p>
              </Link>
            </li>
            <li className={`${styles.item.li}`}>
              <Link href="/" passHref>
                <p className={styles.item.p}>Feedback</p>
              </Link>
            </li>
            <li className="mb-1 pt-2">
              <button
                className="py-1 w-full rounded-md bg-gray-900/5 text-center font-medium hover:bg-gray-900/10"
                onClick={handleSignOut}
              >
                <FontAwesomeIcon icon={faSignOutAlt} />{' '}
                <span className="ml-1 font-semibold">Sign Out</span>
              </button>
            </li>
          </ul>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}
