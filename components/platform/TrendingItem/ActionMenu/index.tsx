import { Fragment, useEffect, useState } from 'react'
import {
  faEllipsis,
  faHandSparkles,
  faThumbtack,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Menu, Transition } from '@headlessui/react'
import { useAuth } from '@lib/context/AuthContext'
import httpCsr from '@lib/utils/http-csr'
import toast from 'react-hot-toast'
import { TCreation } from '@lib/context/CreationsContext'

export type TActionMenu = {
  creation: TCreation
}

const styles = {
  action: {
    icon: 'w-6',
    button:
      'px-2 py-1 rounded w-full space-x-2 text-left whitespace-nowrap hover:bg-blue-600/80 hover:text-white',
  },
}

export const ActionMenu: React.FC<TActionMenu> = ({ creation }) => {
  const { whoAmI } = useAuth()

  const [followedId, setFollowedId] = useState(null)
  const [pinnedId, setPinnedId] = useState(null)

  const handleTogglePin = async () => {
    if (whoAmI) {
      const { data, status } = await httpCsr.put('/user/toggle-pin', {
        creation_id: creation.id,
        pin_id: pinnedId,
      })
      // if in pins list, update creation list first
      if (status === 201) {
        // pins not allowed more than 6
        if (data.message) toast.error(data.message)

        setPinnedId(data?.id || null)
        data ? toast.success('Pinned!') : toast.success('Unpinned!')
      }
    } else {
      toast.error('You must be logged in to pin creations.')
    }
  }

  const handleToggleFollow = async () => {
    if (whoAmI) {
      const { data, status } = await httpCsr.put('/user/toggle-follow', {
        followee_id: creation.owner_id,
        follow_id: followedId,
      })
      // if in follows list, update creation list first
      if (status === 201) {
        setFollowedId(data?.id || null)

        data
          ? toast.success('You are now following this user.')
          : toast.success('You are no longer following this user.')
      }
    } else {
      toast.error('You must be logged in to follow creations.')
    }
  }

  useEffect(() => {
    const fetchFollowed = async () => {
      const { data, status } = await httpCsr.get(
        `/follow/is-followed?followee_id=${creation.owner_id}`
      )

      if (status === 200) {
        setFollowedId(data)
      }
    }

    const fetchPinned = async () => {
      const { data, status } = await httpCsr.get(
        `/creation/is-pinned?creation_id=${creation.id}`
      )

      if (status === 200) {
        setPinnedId(data)
      }
    }

    whoAmI && whoAmI?.id !== creation.owner_id && fetchFollowed()
    whoAmI && fetchPinned()
  }, [whoAmI])

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button
            className={`m-1 w-7 h-7 text-lg hover:text-black rounded-full active:bg-black/5 ${
              open ? 'bg-white text-black' : 'text-black/30'
            }`}
          >
            <FontAwesomeIcon
              icon={faEllipsis}
              className={`${
                open ? '-rotate-90' : ''
              } transition-transform duration-500 ease-in-out`}
            />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 bottom-10 z-50 px-1 py-1 w-fit min-w-[12rem] origin-top-right bg-white divide-y divide-gray-200/80 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {whoAmI && (
                <Menu.Item>
                  {/* TOGGLE PIN */}
                  <button
                    onClick={handleTogglePin}
                    className={styles.action.button}
                  >
                    <FontAwesomeIcon
                      icon={faThumbtack}
                      className={`${styles.action.icon} ${
                        pinnedId ? 'rotate-45' : ''
                      }`}
                    />
                    <span>{pinnedId ? 'Remove from Pins' : 'Add to Pins'}</span>
                  </button>
                </Menu.Item>
              )}
              {whoAmI?.id !== creation.owner_id ? (
                <Menu.Item>
                  {/* TOGGLE FOLLOW */}
                  <button
                    onClick={handleToggleFollow}
                    className={`${styles.action.button} hover:!bg-blue-600 hover:text-white`}
                  >
                    <FontAwesomeIcon
                      icon={followedId ? faXmark : faHandSparkles}
                      className={styles.action.icon}
                    />
                    <span>
                      <span className="text-sm">
                        {followedId ? 'Unfollow ' : 'Follow '}
                      </span>
                      @{creation?.owner?.username}
                    </span>
                  </button>
                </Menu.Item>
              ) : (
                <></>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
