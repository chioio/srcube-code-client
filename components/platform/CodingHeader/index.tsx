import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPencilAlt as fasPencilAlt,
  faCloud as fasCloud,
  faCodeFork,
} from '@fortawesome/free-solid-svg-icons'

import { LogoIcon, UserMenu } from '@components/common'
import { useRouter } from 'next/router'
import { TUrlQuery } from 'pages/[username]'
import { useAuth } from '@lib/context/AuthContext'
import { ViewSwitcher } from '../CodingViewSwitcher'
import { useCoding } from '@lib/context/CodingContext'
import httpCsr from '@lib/utils/http-csr'
import toast from 'react-hot-toast'
import Link from 'next/link'

export const CodingHeader: React.FC<any> = () => {
  const { whoAmI } = useAuth()
  const router = useRouter()
  const { username } = router.query as TUrlQuery

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <header className="flex items-center px-4 py-2 bg-white dark:bg-gray-900/90">
      <button onClick={handleLogoClick}>
        <LogoIcon />
      </button>
      {/* Work Info */}
      <CreationTitle />
      {/* Work Control */}
      <div className="flex">
        {username && username !== whoAmI?.username ? (
          <ForkButton />
        ) : (
          <SaveButton />
        )}
        {/* <WorkDetails /> */}
        <ViewSwitcher />
      </div>
      {/* User */}
      {whoAmI && <UserMenu />}
    </header>
  )
}

export const SaveButton: React.VFC<any> = () => {
  const { creation } = useCoding()
  const { whoAmI } = useAuth()

  const router = useRouter()
  const { id } = router.query

  const handleSave = async () => {
    const param = {
      title: creation.title,
      code_html: creation.code_html,
      code_css: creation.code_css,
      code_js: creation.code_js,
    }

    const { data, status } = id
      ? await httpCsr.post(`/creation/update?id=${id}`, param)
      : await httpCsr.post('/creation', param)

    if (status === 200) {
      toast.success('Save success!')
    }

    if (status === 201) {
      toast.success('Create success!')
      router.push(
        '/[username]/creation/[id]',
        `/${whoAmI?.username}/creation/${data.id}`
      )
    }
  }

  return (
    <button
      onClick={handleSave}
      className="mr-2.5 px-4 rounded-md leading-10 text-white bg-blue-600 active:bg-blue-700 active:shadow-md active:text-gray-100"
    >
      <FontAwesomeIcon icon={fasCloud} className="mr-1.5" />
      <span className="text-lg font-md">Save</span>
    </button>
  )
}

export const ForkButton: React.VFC<any> = () => {
  const { whoAmI } = useAuth()
  const router = useRouter()
  const { creation, dispatch } = useCoding()

  const handleFork = async () => {
    const { _id, createdAt, updatedAt, stars, comments, ...rest } =
      creation as any

    const param = {
      title: rest.title,
      code_html: rest.code_html,
      code_css: rest.code_css,
      code_js: rest.code_js,
    }

    const { data, status } = await httpCsr.post('/creation', param)

    if (status === 201) {
      toast.success('Fork success!')
      dispatch({
        type: 'SET_CREATION',
        payload: {
          creation: {
            ...data,
            owner_id: whoAmI?.username,
            stars: 0,
            comments: 0,
          },
        },
      })
      router.push(
        '/[username]/creation/[id]',
        `/${whoAmI?.username}/creation/${data.id}`
      )
    }
  }

  return (
    <button
      onClick={handleFork}
      className="mr-2.5 px-4 rounded-md leading-10 text-white bg-blue-600 active:bg-blue-700 active:shadow-md active:text-gray-100"
    >
      <FontAwesomeIcon icon={faCodeFork} className="mr-1.5" />
      <span className="text-lg font-md">Fork</span>
    </button>
  )
}

export const CreationTitle: React.VFC<any> = () => {
  const router = useRouter()
  const { username } = router.query as TUrlQuery

  const [isEditable, setIsEditable] = useState<boolean>(false)

  const { creation, dispatch } = useCoding()
  const [title, setTitle] = useState(creation?.title)

  return (
    <div className="flex-grow flex flex-col ml-3">
      <h2 className="leading-4">
        {isEditable ? (
          <input
            id="editable-title-input"
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
              setIsEditable(false)
              e.target.value &&
                dispatch({
                  type: 'SET_CREATION',
                  payload: {
                    creation: {
                      ...creation,
                      title,
                    },
                  },
                })
              title || setTitle(creation.title)
            }}
            value={title}
            onChange={(e: React.FocusEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="text-lg font-bold outline-none"
            autoFocus
          />
        ) : (
          <>
            <span className="text-lg font-bold">{creation?.title}</span>
            <FontAwesomeIcon
              icon={fasPencilAlt}
              onClick={() => {
                setIsEditable(true)
              }}
              className="ml-1 text-sm cursor-pointer hover:transition hover:-rotate-12 hover:opacity-60"
            />
          </>
        )}
      </h2>
      {username && (
        <Link href={`/${creation.owner?.username}`}>
          <a className="inline text-sm leading-3 font-medium opacity-40">
            <span>{'@' + creation?.owner?.username}</span>
          </a>
        </Link>
      )}
    </div>
  )
}
