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
import { TCreation, useCreations } from '@lib/context/CreationsContext'
import { useRouter } from 'next/router'
import { TUrlQuery } from 'pages/[username]'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { Follow } from 'typings'

export type TActionMenu = {
  creation: TCreation
  onDelete?: () => void
}

const styles = {
  action: {
    icon: 'w-6',
    button:
      'px-2 py-1 rounded w-full space-x-2 text-left whitespace-nowrap hover:bg-blue-600/80 hover:text-white',
  },
}

export const ActionMenu: React.FC<TActionMenu> = ({ creation, onDelete }) => {
  const { whoAmI } = useAuth()

  const { dispatch } = useCreations()

  const router = useRouter()
  const { tab } = router.query as TUrlQuery

  const [follow, setFollow] = useState<Follow | null>(null)

  const handleTogglePin = async () => {
    if (whoAmI) {
      const { data, status } = await httpCsr.put('/user/toggle-pin', {
        creation_id: creation.id,
        pin_id: creation?.pins[0]?.id || null,
      })
      // if in pins list, update creation list first
      if (status === 201) {
        // pins not allowed more than 6
        if (data.message) toast.error(data.message)
        if (!tab)
          dispatch({
            type: 'REMOVE_PIN',
            payload: { pin_id: creation?.pins[0]!.id },
          })
        // update pins in stars list or creations list
        if (tab === 'stars' || tab === 'creations') {
          dispatch({
            type: 'TOGGLE_PIN',
            payload: {
              pin: data,
              creation_id: creation.id,
            },
          })
        }
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
        follow_id: follow?.id || null,
      })
      // if in follows list, update creation list first
      if (status === 201) {
        setFollow(data)

        data
          ? toast.success('You are now following this user.')
          : toast.success('You are no longer following this user.')
      }
    } else {
      toast.error('You must be logged in to follow creations.')
    }
  }

  useEffect(() => {
    // get follow status
    const getFollow = async () => {
      if (creation.owner_id !== whoAmI?.id) {
        const { data, status } = await httpCsr.get('/user/follow', {
          params: {
            followee_id: creation.owner_id,
          },
        })

        if (status === 200) {
          setFollow(data)
        }
      }
    }

    whoAmI && getFollow()
  }, [whoAmI, creation.owner_id])

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
                        creation?.pins.length ? 'rotate-45' : ''
                      }`}
                    />
                    <span>
                      {creation?.pins.length
                        ? 'Remove from Pins'
                        : 'Add to Pins'}
                    </span>
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
                      icon={follow ? faXmark : faHandSparkles}
                      className={styles.action.icon}
                    />
                    <span>
                      <span className="text-sm">
                        {follow ? 'Unfollow ' : 'Follow '}
                      </span>
                      @{creation?.owner.username}
                    </span>
                  </button>
                </Menu.Item>
              ) : (
                <Menu.Item>
                  {/* DELETE CREATION */}
                  <button
                    onClick={onDelete}
                    className={`${styles.action.button} hover:!bg-red-500 hover:text-white`}
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      className={styles.action.icon}
                    />
                    <span>Delete</span>
                  </button>
                </Menu.Item>
              )}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}
